const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const folderPath = path.join(__dirname, "files");

// Checking if the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the File API. Use POST /create-file to create a file and GET /get-files to list all files."
  );
});

// route for /create-file
app.get("/create-file", (req, res) => {
  res.send("To create a file, send a POST request to /create-file.");
});

// API endpoint to create a text file - "POST /create-file"
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

// Information route for /get-files
app.get("/get-files", (req, res) => {
  res.send("To retrieve all files, send a GET request to /get-files.");
});

// API endpoint to retrieve all text files - "GET /get-files"
app.get("/files", (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Failed to retrieve files" });
    }

    const textFiles = files.filter((file) => path.extname(file) === ".txt");
    res.json({ files: textFiles });
  });
});

// handlingundefined routes
app.use((req, res) => {
  res
    .status(404)
    .send(
      "Endpoint not found. Use POST /create-file to create a file and GET /get-files to list all files."
    );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
