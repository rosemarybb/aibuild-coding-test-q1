const https = require('https');
const http = require('http');

const goodTime = 500;
const fineTime = 5000;

const connectionSpeedTest = (url) => {
    if (!url || url === "") {
        return;
    }

    let urlObj = new URL(url);

    const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'GET'
    }

    let start = Date.now();

    const httpClient = urlObj.protocol === 'http' ? http : https;

    const req = httpClient.request(options, res => {
        let end = Date.now();

        if (end - start <= goodTime) {
            console.log('good');
            return;
        }

        if ((end - start) > goodTime && (end - start) < fineTime) {
            console.log('fine');
            return;
        }

        console.log('terrible');
    });

    req.on('socket', socket => {
        socket.setTimeout(fineTime);
        socket.on('timeout', function() {
            req.abort();
        });
    })

    req.on('error', error => {
        console.log('terrible');
        req.abort();
    });

    req.end();
}

connectionSpeedTest('https://www.google.com');
