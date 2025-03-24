import { useMutation } from "@tanstack/react-query";
import { atom, useAtom, useAtomValue } from "jotai";
import type { PrimitiveAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { Button } from "react-aria-components";
import AnsiCode from "./AnsiCode";
import { codeAtom, store, webContainerAtom } from "./state";

type Run = {
	date: Date;
	output: string;
};

function RunBlock({ run }: { run: PrimitiveAtom<Run> }) {
	const value = useAtomValue(run);

	return (
		<div>
			<span>{value.date.toLocaleTimeString()}</span>
			<AnsiCode code={value.output} />
		</div>
	);
}

export default function Output() {
	const [code] = useAtom(codeAtom);
	const [webContainer] = useAtom(webContainerAtom);
	const runsAtom = useMemo(() => atom<PrimitiveAtom<Run>[]>([]), []);

	const { mutate } = useMutation({
		async mutationFn(run: Run) {
			const runAtom = atom(run);
			store.set(runsAtom, (prev) => [...prev, runAtom]);

			await webContainer.fs.writeFile("index.mjs", code);
			const process = await webContainer.spawn("node", ["index.mjs"]);
			await process.output.pipeTo(
				new WritableStream({
					write(chunk) {
						store.set(runAtom, (prev) => ({
							date: prev.date,
							output: prev.output + chunk,
						}));
					},
				}),
			);
		},
	});

	const handleClick = useCallback(
		() => mutate({ date: new Date(), output: "" }),
		[mutate],
	);

	useEffect(() => {
		const listener = (ev: KeyboardEvent) => {
			if (ev.ctrlKey && ev.key === "s") {
				ev.preventDefault();
				handleClick();
			}
		};

		document.addEventListener("keydown", listener);
		return () => document.removeEventListener("keydown", listener);
	});

	const runs = useAtomValue(runsAtom);

	return (
		<div className="overflow-auto h-full flex flex-col-reverse">
			<Button onPress={handleClick}>Run</Button>
			<div>
				{runs.map((run) => (
					<RunBlock key={run.toString()} run={run} />
				))}
			</div>
		</div>
	);
}
