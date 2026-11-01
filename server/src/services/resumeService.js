import fs from "node:fs/promises";
import { extractResumeText as extractDocument } from "./resumeParser.js";
export async function extractResumeText(filePath) {
  return extractDocument({
    buffer: await fs.readFile(filePath),
    mimetype: filePath.toLowerCase().endsWith(".docx")
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/pdf",
  });
}
export async function deleteResumeFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch {}
}
