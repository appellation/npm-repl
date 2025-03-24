import { useAtom } from "jotai";
import { codeAtom, webContainerAtom } from "./state";
import { useCallback, useState } from "react";

export default function Output() {
  const [code] = useAtom(codeAtom);
  const [webContainer] = useAtom(webContainerAtom);
  const [output, setOutput] = useState("");

  const handleClick = useCallback(() => {
    setOutput("");

    (async () => {
      try {
        await webContainer.fs.writeFile("index.mjs", code);
        const process = await webContainer.spawn("node", ["index.mjs"], {
          env: { NO_COLOR: true },
        });
        await process.output.pipeTo(
          new WritableStream({
            write(chunk) {
              console.log(chunk);
              setOutput((output) => output + chunk);
            },
          })
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [code]);

  return (
    <div>
      <button onClick={handleClick}>Run</button>
      <pre>{output}</pre>
    </div>
  );
}
