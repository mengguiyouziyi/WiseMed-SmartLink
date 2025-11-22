const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 获取页面 HTML
    const html = await page.content();
    console.log('=== PAGE HTML ===');
    console.log(html.substring(0, 2000)); // 只显示前 2000 字符

    // 查找所有 input 元素
    const inputs = await page.$$eval('input', elements =>
        elements.map(el => ({
            type: el.type,
            placeholder: el.placeholder,
            name: el.name,
            id: el.id
        }))
    );

    console.log('\n=== INPUT ELEMENTS ===');
    console.log(JSON.stringify(inputs, null, 2));

    await browser.close();
})();
