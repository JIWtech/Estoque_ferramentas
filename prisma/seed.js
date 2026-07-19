const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categoriesData = [
  { id: "fresamento", name: "Pastilhas de Fresamento", prefix: "FRE" },
  { id: "torneamento", name: "Pastilhas de Torneamento", prefix: "TOR" },
  { id: "rosqueamento", name: "Rosqueamento", prefix: "ROS" },
  { id: "porta", name: "Porta-Ferramentas", prefix: "POR" },
  { id: "adaptadores", name: "Adaptadores", prefix: "ADA" },
  { id: "diversos", name: "Diversos", prefix: "DIV" },
];

const seedTools = [
  ["OFER070405TIN-ME15 F40M", "Pastilha/insert Seco para fresamento, geometria OFER 070405, quebra-cavaco M15, classe F40M. Codigo lido em estojo; confirmar aplicacao especifica no porta-fresa.", 157.59, "fresamento"],
  ["OFMR070405TR-M15 T350M", "Pastilha/insert Seco para fresamento, geometria OFMR 070405TR, quebra-cavaco M15, classe T350M. EDP 23951 visivel.", 184.78, "fresamento"],
  ["DCMT070202-F1 TP2500", "Pastilha Seco DCMT para torneamento/acabamento, geometria F1, classe TP2500. Caixa com QTY 10 e EDP 25364.", 84.37, "torneamento"],
  ["KOMX090312TR-ME06 MP2500", "Pastilha Seco KOMX para fresamento, geometria ME06, classe MP2500. Caixa com QTY 10 e EDP 31715.", 144.76, "fresamento"],
  ["XOMX120408TR-D14 T200M", "Pastilha Seco XOMX para fresamento, geometria D14, classe T200M. Caixa com QTY 10 e EDP 40412.", 166.99, "fresamento"],
  ["OOMT060525ZR-MHF-M16 MP2501", "Pastilha Seco OMNU para fresamento, geometria MHF-M16, classe MP2501. Fabricado na Suecia; codigo 6204039 visivel.", 180.95, "fresamento"],
  ["ONMU050410ANTN-M11 MP1501", "Pastilha Seco ONMU para fresamento, geometria M11, classe MP1501/Duratomic. Caixa com QTY 10; codigo EDP 40019.", 226.35, "fresamento"],
  ["XNEX080608TR-M13 MK1500", "Pastilha Seco XNEX para fresamento, geometria M13, classe MK1500. Caixa com QTY 10 e EDP 40019.", 152.81, "fresamento"],
  ["XOMX10T308TR-M09 F40M", "Pastilha Seco XOMX para fresamento, geometria M09, classe F40M. Caixa com QTY 12 e EDP 67879.", 132.36, "fresamento"],
  ["219.19-2020-M08 F17M", "Ferramenta/porta-fresa Seco 219.19-2020-M08 para insertos circulares F17M; leitura gravada no corpo; max RPM 30000.", 72.42, "porta"],
  ["GRAFLEX MS834 36.32", "Adaptador/porta-ferramenta modular Graflex Seco; marcacao MS834 36.32 visivel no corpo. Codigo complementar nao informado.", 1550.74, "adaptadores"],
  ["14ER4.OFG CP500", "Inserto Seco para rosqueamento externo, perfil 14ER4.OFG, classe CP500. Caixa com EDP 26755.", 325.90, "rosqueamento"],
  ["16NR14UN CP500", "Inserto Seco para rosqueamento interno, perfil 16NR14UN, classe CP500. Caixa com EDP 64745.", 178.10, "rosqueamento"],
  ["16ER12UN CP500", "Inserto Seco para rosqueamento externo, perfil 16ER12UN, classe CP500. Caixa com EDP 64745.", 267.00, "rosqueamento"],
  ["16NR8UN CP500", "Inserto Seco para rosqueamento interno, perfil 16NR8UN, classe CP500. Caixa com EDP 64745.", 265.00, "rosqueamento"],
  ["SNMG150608-M5 TP2500", "Pastilha Seco SNMG para torneamento/desbaste, classe TP2500/Duratomic. Caixa com QTY 10 e EDP 14582.", 173.53, "torneamento"],
  ["CNMG120408-M5 TP2500", "Pastilha Seco CNMG para torneamento/acabamento, classe TP2500. Caixa com QTY 10 e EDP 91123.", 46.81, "torneamento"],
  ["CCMT060204-MF2 TP2500", "Pastilha Seco CCMT para torneamento/acabamento, classe TP2500. Caixa com QTY 10 e EDP 66812.", 103.14, "torneamento"],
  ["CNMG120616-M5 TP3000", "Pastilha Seco CNMG para torneamento/desbaste, classe TP3000. Caixa com QTY 10 e EDP 89555.", 170.39, "torneamento"],
  ["CNMG120404-MF1 TP3000", "Pastilha Seco CNMG para torneamento/acabamento, classe TP3000. Caixa com QTY 10 e EDP 91123.", 51.67, "torneamento"],
  ["SNMM250724-R7 TP2000", "Pastilha redonda Seco SNMM 250724, geometria R7, classe TP2000. Codigo EDP 03181.", 118.68, "torneamento"],
  ["RCMX0803MO-M2 TP3000", "Pastilha redonda Seco RCMX 0803MO, geometria M2, classe TP3000. Caixa com QTY 10 e EDP 03181.", 88.25, "torneamento"],
  ["SPGN1204EDTR T250M", "Pastilha Secolor/Seco CCMT 32.50.5-F1, classe CP50. Estojo antigo com QTY 10 e EDP 91123; confirmar equivalencia.", 42.14, "diversos"],
];

async function main() {
  console.log("Iniciando seed do banco de dados...");

  // Seed Categorias
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        prefix: cat.prefix,
      },
    });
  }
  console.log("Categorias inseridas.");

  // Seed Gavetas
  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    await prisma.drawer.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        categoryId: cat.id,
        order: i + 1,
      },
    });
  }
  console.log("Gavetas padrao inseridas.");

    // Seed Produtos
  const counters = {};
  const toolImageMap = {
    "OFER070405TIN-ME15 F40M": "/ferramentas - Copia/imagens_tratadas/OFER070405TN_ME15_F40M.jpg",
    "OFMR070405TR-M15 T350M": "/ferramentas - Copia/imagens_tratadas/OFMR070405TR_M15_T350M.jpg",
    "DCMT070202-F1 TP2500": "/ferramentas - Copia/imagens_tratadas/DCMT070202_F1_TP2500.jpg",
    "KOMX090312TR-ME06 MP2500": "/ferramentas - Copia/imagens_tratadas/XOMX090312TR_ME06_MP2500.jpg",
    "XOMX120408TR-D14 T200M": "/ferramentas - Copia/imagens_tratadas/XOMX120408TR_D14_T200M.jpg",
    "OOMT060525ZR-MHF-M16 MP2501": "/ferramentas - Copia/imagens_tratadas/OOMT0605ZZSR_MHF_M16_MP2501.jpg",
    "ONMU050410ANTN-M11 MP1501": "/ferramentas - Copia/imagens_tratadas/ONMU050410ANTN_M11_MP1501.jpg",
    "XNEX080608TR-M13 MK1500": "/ferramentas - Copia/imagens_tratadas/XNEX080608TR_M13_MK1500.jpg",
    "XOMX10T308TR-M09 F40M": "/ferramentas - Copia/imagens_tratadas/XOMX10T308TR_M09_F40M.jpg",
    "219.19-2020-M08 F17M": "/ferramentas - Copia/imagens_tratadas/219_19_200_MD08_F17M.jpg",
    "GRAFLEX MS834 36.32": "/ferramentas - Copia/imagens_tratadas/GRAFLEX_M5834_36_32.jpg",
    "14ER4.OFG CP500": "/ferramentas - Copia/imagens_tratadas/14ER4_0FG_CP500.jpg",
    "16NR14UN CP500": "/ferramentas - Copia/imagens_tratadas/16NR14UN_CP500.jpg",
    "16ER12UN CP500": "/ferramentas - Copia/imagens_tratadas/16ER12UN_CP500.jpg",
    "16NR8UN CP500": "/ferramentas - Copia/imagens_tratadas/16NR8UN_A1_CP500.jpg",
    "SNMG150608-M5 TP2500": "/ferramentas - Copia/imagens_tratadas/SNMG150608_M5_TP2500.jpg",
    "CCMT060204-MF2 TP2500": "/ferramentas - Copia/imagens_tratadas/CCMT09T302_MF2_CP500.jpg",
    "SNMM250724-R7 TP2000": "/ferramentas - Copia/imagens_tratadas/SNMM250724_R7_TP200.jpg",
    "RCMX0803MO-M2 TP3000": "/ferramentas - Copia/imagens_tratadas/RCMT0803M0_M2_TP3000.jpg",
    "SPGN1204EDTR T250M": "/ferramentas - Copia/imagens_tratadas/SPGN1204EDTR_T250M.jpg"
  };

  for (const [manufacturerCode, description, price, categoryId] of seedTools) {
    const cat = categoriesData.find((c) => c.id === categoryId);
    counters[cat.prefix] = (counters[cat.prefix] || 0) + 1;
    const internalId = `${cat.prefix}-${String(counters[cat.prefix]).padStart(6, "0")}`;

    // Parse package quantity (QTY) from description or apply realistic defaults
    let initialQuantity = 10;
    const qtyMatch = description.match(/QTY\s*(\d+)/i);
    if (qtyMatch) {
      initialQuantity = parseInt(qtyMatch[1], 10);
    } else if (categoryId === "adaptadores" || categoryId === "porta") {
      initialQuantity = 2; // High-value adapters/holders have lower default stock
    }

    await prisma.product.upsert({
      where: { internalId },
      update: {
        quantity: initialQuantity,
        imageUrl: toolImageMap[manufacturerCode] || null,
      },
      create: {
        id: `prod_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`,
        internalId,
        manufacturerCode,
        name: manufacturerCode,
        description,
        categoryId,
        drawerId: categoryId,
        quantity: initialQuantity,
        price,
        status: "Ativo",
        imageUrl: toolImageMap[manufacturerCode] || null,
      },
    });
  }
  console.log("Produtos inseridos.");

  // Seed Contadores de ID interno
  for (const prefix of Object.keys(counters)) {
    await prisma.counter.upsert({
      where: { prefix },
      update: { value: counters[prefix] },
      create: { prefix, value: counters[prefix] },
    });
  }
  console.log("Contadores de ID interno inseridos.");

  // Auditoria inicial
  const auditCount = await prisma.audit.count();
  if (auditCount === 0) {
    await prisma.audit.create({
      data: {
        id: `audit_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`,
        user: "sistema",
        action: "Carga inicial de produtos no banco de dados",
      },
    });
  }

  console.log("Seed concluido com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
