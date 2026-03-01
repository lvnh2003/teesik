const { chromium } = require('playwright');

(async () => {
    console.log("Starting browser...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Navigating to account page...");
    await page.goto('http://localhost:3000/account');

    console.log("Waiting for network idle...");
    await page.waitForLoadState('networkidle');

    console.log("Evaluating the email input state...");
    const emailState = await page.evaluate(() => {
        const input = document.querySelector('input[placeholder="your@email.com"]');
        return input ? { disabled: input.disabled, outerHTML: input.outerHTML } : null;
    });

    console.log("Evaluating the submit button state...");
    const btnState = await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]');
        return btn ? { disabled: btn.disabled, textContext: btn.textContent } : null;
    });

    console.log("Email Input:", emailState);
    console.log("Button state:", btnState);

    await browser.close();
})();
