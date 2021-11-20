let http = require('http');
const url = require('url');

const PORT = 8080;

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
    let q = url.parse(req.url, true);
    let calcObj = {
        operand1: Number(q.query.operand1),
        operator: decodeURIComponent(q.query.operator),
        operand2: Number(q.query.operand2)
    }
    res.end(JSON.stringify(calculate(calcObj)));
}).listen(PORT, () => {
    console.log("Server started at port: " + PORT + " | http://localhost:" + PORT);
});

function calculate(calcObj) {
    switch(calcObj.operator){
        case '+': 
            return calcObj.operand1 + calcObj.operand2;
        case '-': 
            return calcObj.operand1 - calcObj.operand2;
        case '*': 
            return calcObj.operand1 * calcObj.operand2;
        case '/': 
            return calcObj.operand1 / calcObj.operand2;
        default: 
            return 0;
    }
}