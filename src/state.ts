import { WebContainer } from "@webcontainer/api";
import { atom, getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { createHighlighter } from "shiki";

export const codeAtom = atomWithStorage("code", "", undefined, {
	getOnInit: true,
});
export const webContainerAtom = atom(() => WebContainer.boot());
export const highlighterAtom = atom(() =>
	createHighlighter({
		themes: ["vitesse-dark", "vitesse-light"],
		langs: ["javascript", "ansi"],
	}),
);

export const store = getDefaultStore();
