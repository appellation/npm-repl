import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { type FormEvent, useCallback, useState } from "react";
import { Button, Form, Input, Label, TextField } from "react-aria-components";
import AnsiCode from "./AnsiCode";
import { webContainerAtom } from "./state";
import { readAll } from "./util";

function PackageList() {
	const [webContainer] = useAtom(webContainerAtom);

	const { data } = useQuery({
		queryKey: ["npm", "ls"],
		async queryFn() {
			const process = await webContainer.spawn("npm", ["ls"]);
			return readAll(process.output, process.exit);
		},
	});

	return <AnsiCode code={data ?? ""} />;
}

export default function Packages() {
	const [webContainer] = useAtom(webContainerAtom);
	const queryClient = useQueryClient();
	const [installOutput, setInstallOutput] = useState("");

	const { mutate, isPending } = useMutation({
		onMutate() {
			setInstallOutput("");
		},
		async mutationFn(pkgName: string) {
			const process = await webContainer.spawn("npm", [
				"--progress=false",
				"install",
				pkgName,
			]);
			process.output.pipeTo(
				new WritableStream({
					write(chunk) {
						setInstallOutput((output) => output + chunk);
					},
				}),
			);
			return process.exit;
		},
		async onSuccess() {
			// @ts-expect-error tanstack query incorrect types
			await queryClient.invalidateQueries([{ queryKey: ["npm", "ls"] }]);
		},
	});

	const handleAddPackage = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			e.currentTarget.reset();

			const data = new FormData(e.currentTarget);
			mutate(data.get("pkgName") as string);
		},
		[mutate],
	);

	return (
		<div className="w-full overflow-auto box-border">
			<Form
				onSubmit={handleAddPackage}
				className="flex flex-row gap-2 w-full items-end"
			>
				<TextField className="flex-grow">
					<Label>Add Package</Label>
					<Input
						disabled={isPending}
						name="pkgName"
						className="w-full p-2 m-2 rounded border"
						placeholder="lodash"
						data-1p-ignore
					/>
				</TextField>
				<Button
					type="submit"
					isPending={isPending}
					className="h-min w-min p-2 m-2 rounded bg-gray-200 hover:bg-gray-400"
				>
					Add
				</Button>
			</Form>
			<PackageList />
			<AnsiCode code={installOutput} />
		</div>
	);
}
