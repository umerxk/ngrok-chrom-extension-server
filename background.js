chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateNgrokUrl") {
        const url = new URL(request.url);

        // Check if the tab is running on localhost
        if (url.hostname === 'localhost') {
            const port = url.port || 80; // Default port 80 if not specified
            startNgrok(port); // Function to start ngrok
        }
        else {
            alert("Please navigate to a localhost app.");
        }
    }
    else if (request.action === "stopNgrok") {
        stopNgrok();
    }
});


function startNgrok(port) {
    fetch(`http://localhost:${port}`)
        .then(response => {
            if (response.ok) {
                // Port is active, start ngrok
                fetchNgrokURL(port);
            } else {
                alert(`No app found on localhost:${port}`);
            }
        })
        .catch(error => {
            console.error('Error checking localhost:', error);
            alert(`No app running on localhost:${port}`);
        });
}

function fetchNgrokURL(port) {
    fetch(`https://variable-sabine-khokhar-a13c5efb.koyeb.app/start-ngrok?port=${port}`)
        .then(response => response.json())
        .then(data => {
            const ngrokUrl = data.ngrokUrl;
            chrome.storage.local.set({ ngrokUrl });
        })
        .catch(error => console.error('Error starting ngrok:', error));
}


function stopNgrok() {
    fetch(`https://variable-sabine-khokhar-a13c5efb.koyeb.app/stop-ngrok`)
        .then(response => {
            if (response.ok) {
                console.log('Ngrok stopped successfully');
                chrome.storage.local.set({ ngrokUrl: '' });
            } else {
                console.error('Failed to stop ngrok:', response.statusText);
                alert('Failed to stop ngrok');
            }
        })
        .catch(error => {
            console.error('Error stopping ngrok:', error);
            alert('Error stopping ngrok');
        });
}