import { useAtom } from "jotai";
import { editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { codeAtom, highlighterAtom } from "./state";
import { shikiToMonaco } from "@shikijs/monaco";

export default function Editor() {
	const [_, setCode] = useAtom(codeAtom);
	const [highlighter] = useAtom(highlighterAtom);

	useEffect(() => {
		shikiToMonaco(highlighter, monaco);
	}, [highlighter]);

	const mount = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (mount.current) {
			const instance = editor.create(mount.current, {
				language: "javascript",
				theme: "vitesse-light",
			});
			const observer = new ResizeObserver((entries) => {
				const entry = entries[entries.length - 1];
				instance.layout(
					{ height: entry.contentRect.height, width: entry.contentRect.width },
					true,
				);
			});

			observer.observe(mount.current);

			instance.onDidChangeModelContent(() => {
				setCode(instance.getValue());
			});

			return () => {
				observer.disconnect();
				instance.dispose();
			};
		}
	}, [setCode]);

	return <div className="h-full w-full" ref={mount} />;
}
