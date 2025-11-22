/**
 * WiseMed Enterprise Console - UI 自动化测试脚本
 * 
 * 运行方式:
 * 1. 安装依赖: npm install puppeteer
 * 2. 运行脚本: node test-ui.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

// 创建截图目录
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLogin(page) {
    console.log('\n📝 测试 1: 登录页面');

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 10000 });
    await sleep(2000); // 等待页面完全渲染
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-login-page.png'), fullPage: true });
    console.log('✅ 登录页面截图已保存');

    // 等待表单加载
    await page.waitForSelector('input[placeholder="Enter your username"]', { timeout: 10000 });

    // 填写登录表单
    await page.type('input[placeholder="Enter your username"]', 'admin', { delay: 100 });
    await page.type('input[type="password"]', 'admin', { delay: 100 });
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-login-filled.png'), fullPage: true });
    console.log('✅ 表单填写完成');

    // 点击登录
    await page.click('button[type="submit"]');
    console.log('   点击登录按钮...');
    await sleep(3000); // 等待登录处理

    // 截图当前状态
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-after-login.png'), fullPage: true });
    console.log('✅ 登录流程完成');
}

async function testDashboard(page) {
    console.log('\n📊 测试 2: Dashboard');

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-dashboard.png'), fullPage: true });
    console.log('✅ Dashboard 截图已保存');

    // 检查统计卡片
    const statsCards = await page.$$eval('[class*="statCard"]', cards => cards.length);
    console.log(`   找到 ${statsCards} 个统计卡片`);
}

async function testSmartImaging(page) {
    console.log('\n🖼️  测试 3: Smart Imaging');

    await page.goto(`${BASE_URL}/imaging`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-imaging-page.png'), fullPage: true });
    console.log('✅ Smart Imaging 页面截图已保存');

    // 检查上传区域
    const uploadZone = await page.$('[class*="dropzone"]');
    if (uploadZone) {
        console.log('   ✅ 找到上传区域');
    }

    // 检查查看器
    const viewer = await page.$('[class*="viewerContainer"]');
    if (viewer) {
        console.log('   ✅ 找到 DICOM 查看器');
    }
}

async function testGlobalClinic(page) {
    console.log('\n🌐 测试 4: Global Clinic');

    await page.goto(`${BASE_URL}/clinic`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-clinic-page.png'), fullPage: true });
    console.log('✅ Global Clinic 页面截图已保存');

    // 检查录音按钮
    const recordButton = await page.$('button');
    if (recordButton) {
        const buttonText = await page.evaluate(el => el.textContent, recordButton);
        console.log(`   ✅ 找到按钮: ${buttonText.trim()}`);
    }
}

async function testNavigation(page) {
    console.log('\n🧭 测试 5: 侧边栏导航');

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(1000);

    // 测试导航链接
    const navItems = await page.$$eval('a[href*="/dashboard"]', links =>
        links.map(link => ({ text: link.textContent.trim(), href: link.getAttribute('href') }))
    );

    console.log(`   找到 ${navItems.length} 个导航链接:`);
    navItems.forEach(item => {
        if (item.text) console.log(`     - ${item.text}: ${item.href}`);
    });

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-navigation.png'), fullPage: true });
    console.log('✅ 导航测试完成');
}

async function runTests() {
    console.log('🚀 开始 WiseMed Enterprise Console UI 测试\n');
    console.log(`📁 截图将保存到: ${SCREENSHOT_DIR}\n`);

    // 尝试连接到现有的 Chrome CDP
    const CDP_URL = 'http://127.0.0.1:9222';
    console.log(`\n🔌 尝试连接到 Chrome CDP: ${CDP_URL}`);

    let browser;
    try {
        browser = await puppeteer.connect({
            browserURL: CDP_URL,
            defaultViewport: { width: 1920, height: 1080 }
        });
        console.log('✅ 成功连接到现有 Chrome 实例');
    } catch (err) {
        console.log('⚠️ 无法连接到 CDP，尝试启动新实例...', err.message);
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        await testLogin(page);
        await testDashboard(page);
        await testSmartImaging(page);
        await testGlobalClinic(page);
        await testNavigation(page);

        console.log('\n✅ 所有测试完成！');
        console.log(`📸 共生成 ${fs.readdirSync(SCREENSHOT_DIR).length} 张截图`);
        console.log(`📂 查看截图: ${SCREENSHOT_DIR}\n`);

    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error.png'), fullPage: true });
    } finally {
        await browser.close();
    }
}

// 运行测试
runTests().catch(console.error);
