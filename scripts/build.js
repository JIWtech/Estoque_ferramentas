process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

const { execSync } = require("child_process");

console.log("=== INICIANDO BUILD PARA DEPLOY ===");
console.log("DATABASE_URL:", process.env.DATABASE_URL);

try {
  console.log("1. Gerando Prisma Client...");
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });

  console.log("2. Sincronizando schema do banco de dados (db push)...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });

  console.log("3. Executando seed do banco de dados...");
  execSync("node prisma/seed.js", { stdio: "inherit", env: process.env });

  console.log("=== BUILD CONCLUÍDO COM SUCESSO! ===");
} catch (error) {
  console.error("Erro durante o build:", error);
  process.exit(1);
}
