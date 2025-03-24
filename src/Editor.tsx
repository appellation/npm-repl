import { shikiToMonaco } from "@shikijs/monaco";
import { useAtom } from "jotai";
import { editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { codeAtom, highlighterAtom } from "./state";

export default function Editor() {
	const [code, setCode] = useAtom(codeAtom);
	const [highlighter] = useAtom(highlighterAtom);

	useEffect(() => {
		shikiToMonaco(highlighter, monaco);
	}, [highlighter]);

	const mount = useRef<HTMLDivElement>(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: cannot recreate editor on code change
	useEffect(() => {
		if (!mount.current) return;

		const instance = editor.create(mount.current, {
			language: "javascript",
			theme: "vitesse-light",
			value: code,
			minimap: { enabled: false },
		});
		instance.onDidChangeModelContent(() => {
			setCode(instance.getValue());
		});

		const observer = new ResizeObserver((entries) => {
			const entry = entries[entries.length - 1];
			instance.layout(
				{ height: entry.contentRect.height, width: entry.contentRect.width },
				true,
			);
		});
		observer.observe(mount.current);

		return () => {
			instance.dispose();
			observer.disconnect();
		};
	}, [setCode]);

	return <div className="h-full w-full" ref={mount} />;
}
