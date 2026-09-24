import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const routeHtml = path.join(root, "out", "ask_document.html");
const routeDirectory = path.join(root, "out", "ask_document");
const routeIndex = path.join(routeDirectory, "index.html");
const publicData = path.join(
  routeDirectory,
  "knowledge-base.v1.0.0.public.json",
);

await access(routeHtml);
await access(publicData);
await mkdir(routeDirectory, { recursive: true });
await copyFile(routeHtml, routeIndex);

console.log("Prepared out/ask_document/ as a physical static Hostinger route.");
