const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

http
  .createServer((req, res) => {
    let filePath = req.url === '/' ? './index.html' : `.${req.url}`;

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        if (extname === '.js') contentType = 'text/javascript';
        else if (extname === '.css') contentType = 'text/css';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  })
  .listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
