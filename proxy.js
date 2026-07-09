const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        console.log(`[PROXY] -> Request to: ${req.url}`);
        
        const options = {
            hostname: 'agentrouter.org',
            path: req.url.replace('/v1/responses', '/responses'),
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-r2sl0SAKgKsu4LDQHeV03n1xa78JoYRGwHUTINg711pAwnbE`
            }
        };

        const proxyReq = https.request(options, proxyRes => {
            console.log(`[PROXY] <- Response Status: ${proxyRes.statusCode}`);
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', e => {
            console.error(`[PROXY] Error: ${e.message}`);
            res.writeHead(500);
            res.end();
        });

        if (body) {
            proxyReq.write(body);
        }
        proxyReq.end();
    });
});

server.listen(1234, () => {
    console.log('Proxy listening on http://localhost:1234');
});
