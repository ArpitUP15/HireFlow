import multer from "multer";
export const resumeUpload = multer({
 storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 },
 fileFilter: (req, file, cb) => cb(
  ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.mimetype)
   ? null : Object.assign(new Error("Only PDF and DOCX files are supported"), { status: 400 }), true),
});
