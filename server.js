const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

// ----------------------
// File Upload
// ----------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ----------------------
// Upload Photo
// ----------------------

app.post("/upload", upload.single("photo"), (req, res) => {
  try {
    const galleryPath = "./public/data/gallery.json";

    const gallery = JSON.parse(fs.readFileSync(galleryPath, "utf8"));

    gallery.push({
      title: req.body.title,
      image: "/uploads/" + req.file.filename,
    });

    fs.writeFileSync(galleryPath, JSON.stringify(gallery, null, 2));

    res.json({
      success: true,
      photo: gallery[gallery.length - 1],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
});

// ----------------------
// Get Gallery
// ----------------------

app.get("/gallery", (req, res) => {
  const gallery = JSON.parse(
    fs.readFileSync("./public/data/gallery.json", "utf8"),
  );

  res.json(gallery);
});

// ----------------------
// Delete Photo
// ----------------------

app.delete("/delete/:index", (req, res) => {
  const index = Number(req.params.index);

  const galleryPath = "./public/data/gallery.json";

  const gallery = JSON.parse(fs.readFileSync(galleryPath, "utf8"));

  if (index < 0 || index >= gallery.length) {
    return res.status(404).json({
      success: false,
    });
  }

  const deleted = gallery[index];

  const imagePath = path.join(__dirname, "public", deleted.image);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  gallery.splice(index, 1);

  fs.writeFileSync(galleryPath, JSON.stringify(gallery, null, 2));

  res.json({
    success: true,
  });
});

// ----------------------
// Get Config
// ----------------------

app.get("/config", (req, res) => {
  const config = JSON.parse(
    fs.readFileSync("./public/data/config.json", "utf8"),
  );

  res.json(config);
});

// ----------------------
// Save Config
// ----------------------

app.post("/config", (req, res) => {
  fs.writeFileSync(
    "./public/data/config.json",
    JSON.stringify(req.body, null, 2),
  );

  res.json({
    success: true,
  });
});

// ----------------------

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
