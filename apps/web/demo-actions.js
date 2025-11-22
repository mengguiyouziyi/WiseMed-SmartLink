
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'demo');

if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
    console.log('🤖 Starting Browser Demo: Clicking & Scrolling...');

    // Launch browser (ignoring proxy for localhost)
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        // 1. Login
        console.log('👉 Navigating to Login...');
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-login.png') });

        console.log('⌨️  Typing credentials...');
        await page.type('input[placeholder="Enter your username"]', 'admin', { delay: 100 });
        await page.type('input[type="password"]', 'admin', { delay: 100 });

        console.log('🖱️  Clicking Login button...');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-dashboard.png') });
        console.log('✅ Login successful!');

        // 2. Scroll Demo
        console.log('📜 Scrolling down...');
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
        await sleep(1000);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-scrolled-bottom.png') });

        console.log('📜 Scrolling up...');
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(1000);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-scrolled-top.png') });

        // 3. Navigation Click
        console.log('🖱️  Clicking "Smart Imaging" link...');
        // Assuming there's a link with text or href
        const imagingLink = await page.$('a[href*="/imaging"]');
        if (imagingLink) {
            await imagingLink.click();
            await sleep(2000);
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-imaging-page.png') });
            console.log('✅ Navigated to Smart Imaging');
        } else {
            console.log('⚠️ Could not find Smart Imaging link');
        }

    } catch (error) {
        console.error('❌ Demo failed:', error);
    } finally {
        await browser.close();
        console.log('👋 Demo complete. Screenshots saved in apps/web/screenshots/demo/');
    }
}

runDemo();
