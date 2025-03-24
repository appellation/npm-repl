import { useAtom } from "jotai";
import { editor } from "monaco-editor";
import { useEffect, useRef } from "react";
import { codeAtom } from "./state";

import "./Editor.css";

export default function Editor() {
  const [_, setCode] = useAtom(codeAtom);

  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mount.current) {
      const instance = editor.create(mount.current, {
        language: "javascript",
      });
      const observer = new ResizeObserver((entries) => {
        const entry = entries[entries.length - 1];
        instance.layout(
          { height: entry.contentRect.height, width: entry.contentRect.width },
          true
        );
      });

      observer.observe(mount.current);

      instance.onDidChangeModelContent(() => {
        setCode(instance.getValue());
        console.log(instance.getValue());
      });

      return () => {
        observer.disconnect();
        instance.dispose();
      };
    }
  }, []);

  return <div className="container" ref={mount} />;
}
