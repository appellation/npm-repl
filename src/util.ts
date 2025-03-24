export async function readAll(
  stream: ReadableStream,
  donePromise: Promise<any>
) {
  let output = "";

  return new Promise<string>((resolve, reject) => {
    donePromise.then(() => resolve(output));

    const outputStream = new WritableStream({
      write(chunk) {
        output += chunk;
      },
      close() {
        resolve(output);
      },
      abort(reason) {
        reject(reason);
      },
    });

    stream.pipeTo(outputStream);
  });
}
