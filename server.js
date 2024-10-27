const express = require('express');
const ngrok = require('ngrok');

const app = express();
app.enable('trust proxy');

app.get('/start-ngrok', async (req, res) => {
    const { port } = req.query;
    console.log("port::", port);
    if (!port) {
        return res.status(400).send('Port is required');
    }

    try {
        const url = await ngrok.connect({
            addr: port,
            host_header: `localhost:${port}` // Replace with your host:port
        });
        console.log(`ngrok tunnel opened at ${url}`);
        res.json({ ngrokUrl: url });
    } catch (error) {
        console.error('Error starting ngrok:', error);
        res.status(500).send('Failed to start ngrok');
    }
});

app.get('/stop-ngrok', async (req, res) => {
    try {
        await ngrok.disconnect(); // Stop ngrok
        console.log('ngrok tunnel closed');
        res.send('ngrok tunnel closed');
    } catch (error) {
        console.error('Error stopping ngrok:', error);
        res.status(500).send('Failed to stop ngrok');
    }
});

app.get("/", async (req, res) => {
    res.send("server is running...");
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
