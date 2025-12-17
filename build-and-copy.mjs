import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const appDir = resolve(rootDir, "shadcn-ui");
const sourceDir = resolve(appDir, "dist");
const targetDir = resolve(rootDir, "dist");

console.log("Building shadcn-ui project...");
execSync("pnpm run build", { cwd: appDir, stdio: "inherit", shell: true });

if (!existsSync(sourceDir)) {
  throw new Error(`Build output not found at ${sourceDir}`);
}

console.log("Copying build output to project root dist/ ...");
rmSync(targetDir, { recursive: true, force: true });
cpSync(sourceDir, targetDir, { recursive: true });
console.log("Build output ready at", targetDir);
