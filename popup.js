document.addEventListener('DOMContentLoaded', function () {
    updateNgrokUrlDisplay();

    document.getElementById('stop-ngrok').addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: "stopNgrok" }); // Send stop action to background
    });

    document.getElementById('generate-url').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            chrome.runtime.sendMessage({ action: "generateNgrokUrl", url: activeTab.url });
        });
    });
});


function updateNgrokUrlDisplay() {
    chrome.storage.local.get('ngrokUrl', function (result) {
        document.getElementById('ngrok-url').innerText = result.ngrokUrl || 'No URL generated';
        document.getElementById('generate-url').style.display = result.ngrokUrl ? 'none' : 'block';
        document.getElementById('stop-ngrok').style.display = result.ngrokUrl ? 'block' : 'none';
    });
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.ngrokUrl) {
      updateNgrokUrlDisplay(); // Update display if ngrokUrl changes
    }
  });