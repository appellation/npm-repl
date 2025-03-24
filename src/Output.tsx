import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { Button } from "react-aria-components";
import { codeAtom, webContainerAtom } from "./state";
import AnsiCode from "./AnsiCode";

export default function Output() {
	const [code] = useAtom(codeAtom);
	const [webContainer] = useAtom(webContainerAtom);
	const [output, setOutput] = useState("");

	const handleClick = useCallback(() => {
		setOutput("");

		(async () => {
			try {
				await webContainer.fs.writeFile("index.mjs", code);
				const process = await webContainer.spawn("node", ["index.mjs"]);
				await process.output.pipeTo(
					new WritableStream({
						write(chunk) {
							setOutput((output) => output + chunk);
						},
					}),
				);
			} catch (err) {
				console.error(err);
			}
		})();
	}, [code, webContainer.fs.writeFile, webContainer.spawn]);

	return (
		<div className="overflow-auto">
			<Button onPress={handleClick}>Run</Button>
			<AnsiCode code={output} />
		</div>
	);
}
