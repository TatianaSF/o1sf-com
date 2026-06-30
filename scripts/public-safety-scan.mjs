import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicRoots = ["app", "components", "content", "lib", "public"];
const forbiddenFiles = [".env", ".env.local", ".env.production", ".env.development"];
const secretPatterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /AIza[0-9A-Za-z_-]{20,}/,
  /ghp_[0-9A-Za-z]{20,}/,
  /xox[baprs]-[0-9A-Za-z-]{20,}/,
  /-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/,
];
const privatePathPattern = /(?:^|[\\/])(?:private|secret|secrets|internal|personal)(?:[\\/]|$)/i;
const contactPattern = /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d().\s-]{8,}\d)/i;
const failures = [];

for (const file of forbiddenFiles) {
  if (fs.existsSync(path.join(root, file))) {
    failures.push(`Forbidden environment file present: ${file}`);
  }
}

for (const publicRoot of publicRoots) {
  const absoluteRoot = path.join(root, publicRoot);

  if (!fs.existsSync(absoluteRoot)) {
    continue;
  }

  for (const file of walk(absoluteRoot)) {
    const relativePath = path.relative(root, file);

    if (privatePathPattern.test(relativePath)) {
      failures.push(`Private-looking path in public surface: ${relativePath}`);
    }

    const body = fs.readFileSync(file, "utf8");

    for (const pattern of secretPatterns) {
      if (pattern.test(body)) {
        failures.push(`Secret-like value in ${relativePath}`);
      }
    }

    if (publicRoot === "content" && contactPattern.test(body)) {
      failures.push(`Contact-like personal data in public content: ${relativePath}`);
    }

    if (relativePath.startsWith(`content${path.sep}`) && /\.md$/.test(relativePath)) {
      const status = body.match(/^status:\s*(.+)$/im)?.[1]?.trim();

      if (status && status !== "Public") {
        failures.push(`Non-public content status in ${relativePath}: ${status}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Public safety scan failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Public safety scan passed.");

function* walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (/\.(js|jsx|ts|tsx|md|css|json|svg|html)$/.test(entry.name)) {
      yield fullPath;
    }
  }
}
