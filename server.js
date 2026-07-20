const path = require("path");
const { execSync } = require("child_process");

const dbPath = path.resolve(__dirname, "prisma", "dev.db");
process.env.DATABASE_URL = process.env.DATABASE_URL || `file:${dbPath}`;

// Garantir que a estrutura do banco e dados de seed existam no servidor
try {
  console.log("Verificando/Inicializando banco de dados SQLite em:", process.env.DATABASE_URL);
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });
  execSync("node prisma/seed.js", { stdio: "inherit", env: process.env });
  console.log("Banco de dados verificado e populado com sucesso!");
} catch (err) {
  console.error("Erro na auto-inicialização do banco de dados:", err.message);
}

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend da raiz do projeto
app.use(express.static(__dirname));

// Gerador de ID único simplificado para auditorias e afins
function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
}

// 1. GET /api/state
app.get("/api/state", async (req, res) => {
  try {
    const drawers = await prisma.drawer.findMany({
      orderBy: { order: "asc" },
    });
    const products = await prisma.product.findMany({
      orderBy: { internalId: "asc" },
    });
    const entries = await prisma.entry.findMany({
      orderBy: { date: "desc" },
    });
    const exits = await prisma.exit.findMany({
      orderBy: { date: "desc" },
    });
    const receipts = await prisma.receipt.findMany({
      orderBy: { date: "desc" },
    });
    const audit = await prisma.audit.findMany({
      orderBy: { date: "desc" },
      take: 100, // Limita aos últimos 100 registros para evitar sobrecarga
    });
    const countersList = await prisma.counter.findMany();
    const counters = {};
    countersList.forEach((c) => {
      counters[c.prefix] = c.value;
    });

    res.json({
      loggedIn: true,
      user: "admin",
      drawers,
      products,
      entries,
      exits,
      receipts,
      audit,
      counters,
    });
  } catch (error) {
    console.error("Erro ao carregar estado:", error);
    res.status(500).json({ error: "Erro interno do servidor ao carregar estado" });
  }
});

// 2. POST /api/products
app.post("/api/products", async (req, res) => {
  const { name, manufacturerCode, categoryId, drawerId, quantity, price, status, description, imageUrl, user } = req.body;
  const username = user || "admin";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({ where: { id: categoryId } });
      if (!category) throw new Error("Categoria não encontrada.");

      // Incrementa o contador do prefixo da categoria
      const counter = await tx.counter.upsert({
        where: { prefix: category.prefix },
        update: { value: { increment: 1 } },
        create: { prefix: category.prefix, value: 1 },
      });

      const internalId = `${category.prefix}-${String(counter.value).padStart(6, "0")}`;
      const productId = uid("prod");

      const product = await tx.product.create({
        data: {
          id: productId,
          internalId,
          manufacturerCode,
          name,
          description: description || "",
          categoryId,
          drawerId,
          quantity: Number(quantity) || 0,
          price: Number(price) || 0,
          status: status || "Ativo",
          imageUrl: imageUrl || null,
        },
      });

      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Produto cadastrado: ${internalId}`,
        },
      });

      return product;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(400).json({ error: error.message });
  }
});

// 3. PUT /api/products/:id
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, manufacturerCode, categoryId, drawerId, quantity, price, status, description, imageUrl, user } = req.body;
  const username = user || "admin";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({ where: { id } });
      if (!existingProduct) throw new Error("Produto não encontrado.");

      const updated = await tx.product.update({
        where: { id },
        data: {
          name,
          manufacturerCode,
          categoryId,
          drawerId,
          quantity: quantity !== undefined ? Number(quantity) : existingProduct.quantity,
          price: price !== undefined ? Number(price) : existingProduct.price,
          status,
          description: description || "",
          imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        },
      });

      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Produto editado: ${existingProduct.internalId}`,
        },
      });

      return updated;
    });

    res.json(result);
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    res.status(400).json({ error: error.message });
  }
});

// 4. POST /api/products/bulk
app.post("/api/products/bulk", async (req, res) => {
  const { ids, categoryId, drawerId, status, quantityDelta, pricePercent, user } = req.body;
  const username = user || "admin";

  try {
    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        const product = await tx.product.findUnique({ where: { id } });
        if (!product) continue;

        const updateData = {};
        if (categoryId) updateData.categoryId = categoryId;
        if (drawerId) updateData.drawerId = drawerId;
        if (status) updateData.status = status;
        if (quantityDelta !== undefined) {
          updateData.quantity = Math.max(0, product.quantity + Number(quantityDelta));
        }
        if (pricePercent !== undefined && Number(pricePercent) !== 0) {
          updateData.price = Number((product.price * (1 + Number(pricePercent) / 100)).toFixed(2));
        }

        await tx.product.update({
          where: { id },
          data: updateData,
        });
      }

      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Operação em massa aplicada em ${ids.length} produtos`,
        },
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Erro no update em massa:", error);
    res.status(500).json({ error: "Erro ao processar alteração em massa." });
  }
});

// 5. POST /api/drawers
app.post("/api/drawers", async (req, res) => {
  const { name, categoryId, user } = req.body;
  const username = user || "admin";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const orderCount = await tx.drawer.count();
      const drawer = await tx.drawer.create({
        data: {
          id: uid("gav"),
          name,
          categoryId,
          order: orderCount + 1,
        },
      });

      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Gaveta criada: ${name}`,
        },
      });

      return drawer;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar gaveta:", error);
    res.status(400).json({ error: error.message });
  }
});

// 6. PUT /api/drawers/:id
app.put("/api/drawers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, categoryId, user } = req.body;
  const username = user || "admin";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingDrawer = await tx.drawer.findUnique({ where: { id } });
      if (!existingDrawer) throw new Error("Gaveta não encontrada.");

      const updated = await tx.drawer.update({
        where: { id },
        data: {
          name,
          categoryId,
        },
      });

      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Gaveta editada: ${name}`,
        },
      });

      return updated;
    });

    res.json(result);
  } catch (error) {
    console.error("Erro ao editar gaveta:", error);
    res.status(400).json({ error: error.message });
  }
});

// 7. DELETE /api/drawers/:id
app.delete("/api/drawers/:id", async (req, res) => {
  const { id } = req.params;
  const username = "admin";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const hasProducts = await tx.product.findFirst({ where: { drawerId: id } });
      if (hasProducts) {
        throw new Error("Não é possível excluir gaveta com produtos. Mova os itens antes.");
      }

      const deleted = await tx.drawer.delete({ where: { id } });

      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Gaveta excluída: ${deleted.name}`,
        },
      });

      return deleted;
    });

    res.json({ success: true, deleted: result });
  } catch (error) {
    console.error("Erro ao deletar gaveta:", error);
    res.status(400).json({ error: error.message });
  }
});

// 8. POST /api/entries
app.post("/api/entries", async (req, res) => {
  const { productId, quantity, notes, user } = req.body;
  const username = user || "admin";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produto não encontrado.");

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          quantity: { increment: Number(quantity) },
        },
      });

      const entry = await tx.entry.create({
        data: {
          id: uid("ent"),
          productId,
          quantity: Number(quantity),
          user: username,
          notes: notes || "",
        },
      });

      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Entrada registrada: ${product.internalId} +${quantity}`,
        },
      });

      return { entry, product: updatedProduct };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao registrar entrada:", error);
    res.status(400).json({ error: error.message });
  }
});

// 9. POST /api/exits
app.post("/api/exits", async (req, res) => {
  const { productId, quantity, responsible, destination, reason, signatureName, user } = req.body;
  const username = user || "admin";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produto não encontrado.");

      if (Number(quantity) > product.quantity) {
        throw new Error("Não é permitido retirar quantidade maior do que o estoque disponível.");
      }

      // Gera o número do recibo usando o contador
      const receiptCount = await tx.receipt.count();
      const receiptNumber = `REC-${String(receiptCount + 1).padStart(6, "0")}`;

      const receiptId = uid("rec");
      const exitId = uid("sai");

      // Atualiza o estoque do produto
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          quantity: { decrement: Number(quantity) },
        },
      });

      // Cria o recibo
      const receipt = await tx.receipt.create({
        data: {
          id: receiptId,
          number: receiptNumber,
          productId,
          quantity: Number(quantity),
          price: product.price,
          responsible,
          destination: destination || "",
          reason,
          signatureName,
        },
      });

      // Cria a saída associada
      const exit = await tx.exit.create({
        data: {
          id: exitId,
          receiptId,
          productId,
          quantity: Number(quantity),
          responsible,
          destination: destination || "",
          reason,
        },
      });

      // Registro de auditoria
      await tx.audit.create({
        data: {
          id: uid("audit"),
          user: username,
          action: `Saída finalizada com recibo ${receiptNumber}: ${product.internalId} -${quantity}`,
        },
      });

      return { exit, receipt, product: updatedProduct };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao registrar saida:", error);
    res.status(400).json({ error: error.message });
  }
});

// Qualquer outra rota serve o index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
