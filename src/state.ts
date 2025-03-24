import { WebContainer } from "@webcontainer/api";
import { atom } from "jotai";

export const codeAtom = atom("");
export const webContainerAtom = atom(async () => WebContainer.boot());
