// middleware/multerConfig.js

import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads", // Generic folder for all file types
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Allowed extensions regex (images, docs, code, spreadsheets)
const allowedFileTypes =
  /jpeg|jpg|png|gif|svg|c|cpp|cs|pdf|docx|txt|js|py|java|jsx|csv|xlsx/;

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Increase limit to 20MB if needed
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      "Error: File type not supported! Allowed types: jpg, jpeg, png, gif, pdf, docx, txt, js, py, java, jsx, csv, xlsx"
    );
  }
}

export default upload;
