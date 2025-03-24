import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { highlighterAtom } from "./state";

export default function AnsiCode({ code }: { code: string }) {
	const highlighter = useAtomValue(highlighterAtom);
	const formatted = useMemo(
		() =>
			highlighter.codeToHtml(code, {
				lang: "ansi",
				theme: "vitesse-light",
			}),
		[code, highlighter.codeToHtml],
	);

	// biome-ignore lint/security/noDangerouslySetInnerHtml: shikijs handles sanitization
	return <pre dangerouslySetInnerHTML={{ __html: formatted }} />;
}
