const http = require("http");

const { readFileSync } = require("fs");

const homePage = readFileSync("./index.html");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write(homePage);
    res.end();
  } else if (req.url === "/about") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<h1>About page</h1>");
    res.end();
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.write("<h1>page not found</h1>");
    res.end();
  }
});
server.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
