const express = require("express");

const router = express.Router();

const path = require("path");

router.get("/", (req, res) => {
  res.send("Hello, world");
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});
router.get("/newpage(.html)?", (req, res) => {
  //   res.send("Hello, world");
  res.sendFile(path.join(__dirname, "..", "views", "newpage.html"));
});
router.get("/oldpage(.html)?", (req, res) => {
  res.redirect(301, "/newpage.html");
});
router.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
});

module.exports = router;
