// =============================================
// upload.js — UI Logic for the Upload Page
// Relies on triggerS3Upload() from api.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    const triggerBtn = document.getElementById('triggerBtn');
    
    // Attach click listener to the button
    if (triggerBtn) {
        triggerBtn.addEventListener('click', handleUploadProcess);
    }
});

/**
 * Handles the UI state changes (loading, success, error) 
 * and calls the backend API to process the S3 file.
 */
async function handleUploadProcess() {
    const filenameInput = document.getElementById('s3Filename');
    const statusBox = document.getElementById('statusMessage');
    const loadingBox = document.getElementById('loadingIndicator');
    const btn = document.getElementById('triggerBtn');
    
    const filename = filenameInput.value.trim();

    // 1. Validation
    if (!filename) {
        showStatus('error', 'Please enter a valid S3 filename (e.g., data.csv).');
        filenameInput.focus();
        return;
    }

    if (!filename.endsWith('.csv')) {
        showStatus('error', 'Currently, only .csv files are supported by the pipeline.');
        return;
    }

    // 2. Set UI to Loading State
    btn.disabled = true;
    btn.querySelector('span').innerText = 'Processing...';
    statusBox.style.display = 'none';
    loadingBox.style.display = 'flex';

    try {
        // 3. Call the API (This function lives in api.js)
        // Ensure you added the POST request block to api.js from the previous step!
        const result = await triggerS3Upload(filename);

        // 4. Handle API Response
        if (result && result.status === 'success') {
            showStatus('success', `Pipeline Complete! Successfully cleaned and loaded ${result.rows_loaded} rows into MySQL.`);
            filenameInput.value = ''; // Clear input on success
        } else {
            const errorMsg = result ? result.message : 'Unknown server error occurred.';
            showStatus('error', `Pipeline Failed: ${errorMsg}`);
        }
    } catch (error) {
        showStatus('error', `Connection Failed: Make sure your Flask backend (app.py) is running.`);
        console.error(error);
    } finally {
        // 5. Reset UI State
        btn.disabled = false;
        btn.querySelector('span').innerText = 'Run Pipeline';
        loadingBox.style.display = 'none';
    }
}

/**
 * Helper function to display success or error messages
 */
function showStatus(type, message) {
    const statusBox = document.getElementById('statusMessage');
    statusBox.className = `status-msg status-${type}`;
    
    // Add a small icon based on success/error
    const icon = type === 'success' ? '✓ ' : '⚠ ';
    statusBox.innerText = icon + message;
}