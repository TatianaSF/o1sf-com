import fs from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");
export const contentCollections = ["sections"];

export function getCollection(collection) {
  assertCollection(collection);
  const collectionRoot = path.join(contentRoot, collection);

  if (!fs.existsSync(collectionRoot)) {
    return [];
  }

  return fs
    .readdirSync(collectionRoot)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readItem(collection, file))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getItem(collection, slug) {
  return getCollection(collection).find((item) => item.slug === slug);
}

function readItem(collection, file) {
  const filePath = path.join(contentRoot, collection, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const slug = file.replace(/\.md$/, "");

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    order: Number(data.order || 999),
    status: data.status || "Public",
    body,
    paragraphs: bodyToParagraphs(body),
    ...data,
  };
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, body: raw.trim() };
  }

  const data = {};
  const frontmatter = match[1];

  for (const line of frontmatter.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    data[key] = value;
  }

  return { data, body: match[2].trim() };
}

function bodyToParagraphs(body) {
  return body
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);
}

function assertCollection(collection) {
  if (!contentCollections.includes(collection)) {
    throw new Error(`Unknown content collection: ${collection}`);
  }
}
