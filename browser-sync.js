const compression = require("compression");
const bs = require("browser-sync").create();

bs.init({
  server: "./",
  middleware: [compression()],
  open: "local"
});

bs.reload("*.html");