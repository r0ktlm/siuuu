const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files (index.html, style.css, main.js)
app.use(express.static(path.join(__dirname)));

// Proxy endpoint to bypass Mixed Content (HTTP on HTTPS)
app.get('/proxy/*', async (req, res) => {
    // Reconstruct the target HTTP stream URL
    const targetUrl = 'http://103.151.61.12/' + req.params[0];
    
    try {
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            return res.status(response.status).send(`Failed to fetch from stream source: ${response.statusText}`);
        }
        
        // Forward headers (such as Content-Type for m3u8 or ts segments)
        const contentType = response.headers.get('Content-Type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // Read response body as array buffer and send
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer);
    } catch (err) {
        console.error('Error proxying request:', err);
        res.status(500).send('Proxy error occurred');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
