import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
const invalid = (message) => Object.assign(new Error(message), { status: 400 });
export async function extractResumeText(file) {
  if (!file?.buffer) throw invalid("Resume file is required");
  const buffer = file.buffer;
  let text;
  try {
    if (
      file.mimetype === "application/pdf" &&
      buffer.subarray(0, 5).toString() === "%PDF-"
    ) {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      try {
        text = (await parser.getText()).text;
      } finally {
        await parser.destroy();
      }
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      buffer.subarray(0, 4).equals(Buffer.from([80, 75, 3, 4]))
    ) {
      text = (await mammoth.extractRawText({ buffer })).value;
    } else
      throw invalid(
        "Upload a valid PDF or DOCX file with a matching file signature.",
      );
  } catch (e) {
    if (e.status) throw e;
    throw invalid(
      "Could not read this resume. Upload an unencrypted text PDF or DOCX.",
    );
  }
  text = (text || "").replace(/\0/g, "").trim();
  if (text.length < 40)
    throw invalid("No readable resume text found. Scanned PDFs require OCR.");
  if (text.length > 18000)
    throw invalid(
      "Resume is too long. Maximum extracted text is 18,000 characters.",
    );
  return text;
}
