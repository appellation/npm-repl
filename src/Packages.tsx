import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { type FormEvent, useCallback } from "react";
import { Button, Form, Input, Label, TextField } from "react-aria-components";
import { webContainerAtom } from "./state";
import { readAll } from "./util";
import AnsiCode from "./AnsiCode";

function PackageList() {
	const [webContainer] = useAtom(webContainerAtom);

	const { data } = useQuery({
		queryKey: ["npm", "ls"],
		async queryFn() {
			const process = await webContainer.spawn("npm", ["ls"]);
			const output = readAll(process.output, process.exit);

			await process.exit;
			return output;
		},
	});

	return <AnsiCode code={data ?? ""} />;
}

export default function Packages() {
	const [webContainer] = useAtom(webContainerAtom);
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		async mutationFn(pkgName: string) {
			const process = await webContainer.spawn("npm", ["install", pkgName]);
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
			mutate(data.get("name") as string);
		},
		[mutate],
	);

	return (
		<div>
			<PackageList />
			<Form onSubmit={handleAddPackage}>
				<TextField>
					<Label>Package Name</Label>
					<Input disabled={isPending} name="name" />
				</TextField>
				<Button type="submit" isPending={isPending}>
					Add
				</Button>
			</Form>
		</div>
	);
}
