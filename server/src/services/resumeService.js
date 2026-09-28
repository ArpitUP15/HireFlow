import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractResumeText = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();

  return data.text?.trim() || "";
};

export const deleteResumeFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(
      `Unable to delete resume file: ${error.message}`
    );
  }
};