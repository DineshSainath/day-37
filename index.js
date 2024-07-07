const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const folderPath = path.join(__dirname, "files");

// checking if the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

app.use(express.json());

// API endpoint to create a text file - "url/create-file"
app.post("/create-file", (req, res) => {
  const timestamp = new Date();
  const fileName = `${timestamp.toISOString().replace(/:/g, "-")}.txt`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFile(filePath, timestamp.toString(), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Failed to create file" });
    }
    res.status(201).json({ message: "File created successfully", fileName });
  });
});

// API endpoint to retrieve all text files - "url/get-files"
app.get("/get-files", (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Failed to retrieve files" });
    }

    const textFiles = files.filter((file) => path.extname(file) === ".txt");
    res.json({ files: textFiles });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
