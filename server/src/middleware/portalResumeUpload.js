import multer from "multer";

const portalResumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      const error = new Error("Only PDF resumes are supported");
      error.status = 400;
      callback(error);
      return;
    }

    callback(null, true);
  },
});

export const handlePortalResumeUploadError = (error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "Maximum resume size is 10 MB",
    });
  }
  if (error.status) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
  return next(error);
};

export default portalResumeUpload;
