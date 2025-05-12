import { useEffect, useState } from "react";
import { codeToHtml, type BundledLanguage } from "shiki";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function CodeBlock({
  code,
  lang = "json",
}: {
  code: string;
  lang?: BundledLanguage;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function highlight() {
      const html = await codeToHtml(code, {
        lang,
        theme: "houston",
      });
      setHtml(html);
    }

    highlight();
  }, [code]);

  return (
    <ScrollArea className="border-muted border rounded-xl p-6 bg-[#17191e]">
      <div
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default CodeBlock;
