import Link from "next/link";

export function MarkdownBody({ body }) {
  const blocks = toBlocks(body);

  return (
    <div className="markdown-body">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return <h2 key={index}>{renderInline(block.text)}</h2>;
        }

        if (block.type === "h3") {
          return <h3 key={index}>{renderInline(block.text)}</h3>;
        }

        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

function toBlocks(body) {
  const lines = body.split(/\r?\n/);
  const blocks = [];
  let listItems = [];

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      blocks.push({ type: "h3", text: line.slice(4) });
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    flushList();
    blocks.push({ type: "paragraph", text: line });
  }

  flushList();
  return blocks;
}

function renderInline(text) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);

  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = /^https?:\/\//.test(href);

      if (isExternal) {
        return (
          <a key={index} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        );
      }

      return (
        <Link key={index} href={href}>
          {label}
        </Link>
      );
    }

    return token;
  });
}
