import { WebContainer } from "@webcontainer/api";
import { atom } from "jotai";
import { createHighlighter } from "shiki";

export const codeAtom = atom("");
export const webContainerAtom = atom(() => WebContainer.boot());
export const highlighterAtom = atom(() =>
	createHighlighter({
		themes: ["vitesse-dark", "vitesse-light"],
		langs: ["javascript", "ansi"],
	}),
);
