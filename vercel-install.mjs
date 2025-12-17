import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const rootPackage = resolve(rootDir, "package.json");
const subProjectDir = resolve(rootDir, "shadcn-ui");
const subProjectPackage = resolve(subProjectDir, "package.json");

const installDir = existsSync(rootPackage)
  ? rootDir
  : existsSync(subProjectPackage)
    ? subProjectDir
    : null;

if (!installDir) {
  throw new Error("package.json não encontrado na raiz nem em shadcn-ui/");
}

console.log(`Instalando dependências em ${installDir}`);
execSync("pnpm install", { cwd: installDir, stdio: "inherit", shell: true });
