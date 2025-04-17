import { spawn } from "child_process";

export async function generateEmbedding(text: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", ["generate_embeddings.py", text]);

    let result = "";
    py.stdout.on("data", (data) => (result += data));
    py.stderr.on("data", (err) => console.error("Embedding error:", err));

    py.on("close", () => {
      try {
        const embedding = JSON.parse(result);
        resolve(embedding);
      } catch (err) {
        reject("Failed to parse embedding");
      }
    });
  });
}
