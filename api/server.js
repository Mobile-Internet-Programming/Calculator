let http = require('http');
const url = require('url');

const PORT = 8080;
const calculate =  {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b 

}

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
    let q = url.parse(req.url, true);

    res.write(JSON.stringify(calculate[decodeURIComponent(q.query.operator)](Number(q.query.operand1), Number(q.query.operand2))));
    res.end();
}).listen(PORT, () => {
    console.log("Server started at port: " + PORT + " | http://localhost:" + PORT);
});

