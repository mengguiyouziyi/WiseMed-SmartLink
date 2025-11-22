
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const CDP_URL = 'http://127.0.0.1:9222';
const TARGET_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

async function run() {
    console.log(`Connecting to Chrome CDP at ${CDP_URL}...`);

    try {
        const browser = await puppeteer.connect({
            browserURL: CDP_URL,
            defaultViewport: { width: 1920, height: 1080 }
        });
        console.log('✅ Successfully connected to existing Chrome instance via CDP!');

        const page = await browser.newPage();
        console.log(`Navigating to ${TARGET_URL}...`);
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        if (!fs.existsSync(SCREENSHOT_DIR)) {
            fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
        }

        const screenshotPath = path.join(SCREENSHOT_DIR, 'cdp-verification.png');
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot saved to ${screenshotPath}`);

        await page.close();
        console.log('Test complete. Disconnecting (keeping browser alive)...');
        browser.disconnect();

    } catch (error) {
        console.error('❌ Failed to connect or run CDP test:', error);
        process.exit(1);
    }
}

run();
