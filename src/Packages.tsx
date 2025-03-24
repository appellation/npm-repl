import { useAtom } from "jotai";
import { FormEvent, useCallback, useState } from "react";
import { webContainerAtom } from "./state";
import {
  Button,
  Form,
  Input,
  Label,
  PressEvent,
  TextField,
} from "react-aria-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readAll } from "./util";

function PackageList() {
  const [webContainer] = useAtom(webContainerAtom);

  const { data, error, isPending } = useQuery({
    queryKey: ["npm", "ls"],
    async queryFn() {
      console.log("aaaa");
      const process = await webContainer.spawn("npm", ["ls", "--no-color"]);
      const output = readAll(process.output, process.exit);

      await process.exit;
      console.log("exited");
      return output;
    },
  });
  console.log({ data, error, isPending });

  return <pre>{data}</pre>;
}

export default function Packages() {
  const [webContainer] = useAtom(webContainerAtom);
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(pkgName: string) {
      const process = await webContainer.spawn("npm", ["install", pkgName]);
      return process.exit;
    },
    async onSuccess() {
      await queryClient.invalidateQueries([{ queryKey: ["npm", "ls"] }]);
    },
  });

  const handleAddPackage = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    mutate(data.get("name")! as string);
  }, []);

  return (
    <div>
      <PackageList />
      <Form onSubmit={handleAddPackage}>
        <TextField>
          <Label>Package Name</Label>
          <Input name="name" />
        </TextField>
        <Button type="submit" isPending={isPending}>
          Add
        </Button>
      </Form>
    </div>
  );
}
