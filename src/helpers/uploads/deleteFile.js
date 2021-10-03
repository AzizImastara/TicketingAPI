const fs = require("fs");

const deleteFile = (filePath) => {
  console.log("PROSES DELETE", filePath);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (error) => {
      if (error) {
        console.log("file delete");
        throw error;
      }
    });
  } else {
    console.log("file does not exist");
  }
  // fs.existsSync // mengecek keberadaan isi file
  // fs.unlink // menghapus file
};

module.exports = deleteFile;
