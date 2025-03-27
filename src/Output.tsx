import { useMutation } from "@tanstack/react-query";
import { atom, useAtomValue } from "jotai";
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
	const code = useAtomValue(codeAtom);
	const webContainer = useAtomValue(webContainerAtom);
	const runsAtom = useMemo(() => atom<PrimitiveAtom<Run>[]>([]), []);
	const runs = useAtomValue(runsAtom);

	const { mutate, isPending } = useMutation({
		async mutationFn(run: Run) {
			const runAtom = atom(run);
			store.set(runsAtom, (prev) => [runAtom, ...prev]);

			await webContainer.fs.writeFile("index.mjs", code);
			const process = await webContainer.spawn("node", ["index.mjs"]);
			process.output.pipeTo(
				new WritableStream({
					write(chunk) {
						store.set(runAtom, (prev) => ({
							date: prev.date,
							output: prev.output + chunk,
						}));
					},
				}),
			);
			await process.exit;
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

	return (
		<div className="overflow-auto h-full p-2">
			<Button
				onPress={handleClick}
				className="w-full p-2 text-center bg-gray-200 hover:bg-gray-400 rounded"
				isPending={isPending}
			>
				Run
			</Button>
			<div>
				{runs.map((run) => (
					<RunBlock key={run.toString()} run={run} />
				))}
			</div>
		</div>
	);
}
