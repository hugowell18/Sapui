import puppeteer from 'puppeteer';

(async () => {
    console.log("Starting regression test for Duplicate Column Bug...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Disable cache
    await page.setCacheEnabled(false);

    // Determine correct local URL with polling (wait for Vite to boot)
    const urlsToTry = [
        'http://127.0.0.1:5174/orders',
        'http://localhost:5174/orders'
    ];

    let connectedUrl = null;
    for (let attempt = 0; attempt < 10; attempt++) {
        for (const url of urlsToTry) {
            try {
                console.log(`[Attempt ${attempt + 1}] Trying ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });
                connectedUrl = url;
                break;
            } catch (e) {
                // ignore
            }
        }
        if (connectedUrl) break;
        await new Promise(r => setTimeout(r, 2000));
    }

    if (!connectedUrl) {
        console.error("Failed to connect to Vite development server. Please ensure npm run dev is running.");
        process.exit(1);
    }

    console.log(`Successfully connected to ${connectedUrl}`);

    try {
        // 1. Initial State Check
        await page.waitForSelector('table thead th');
        let thCount = await page.$$eval('table thead th', ths => ths.length);
        console.log(`Initial columns count: ${thCount}`);

        // 2. Click 'Edit Page' bottom-right button
        const editBtn = await page.evaluateHandle(() => {
            return Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Edit Page'));
        });

        if (!editBtn) {
            throw new Error("Could not find 'Edit Page' button.");
        }

        await editBtn.click();
        console.log("Clicked Edit Page");

        // Wait for the panel to appear
        await page.waitForSelector('h2:has-text("Page Properties")', { timeout: 2000 }).catch(() => { });

        // 3. Find the first Data Field Dropdown (Targeting the first column configuration)
        const targetTrigger = await page.evaluateHandle(() => {
            // 找到有 title="Select Data Field Path" 的所以 trigger，取第一个
            return document.querySelectorAll('button[title="Select Data Field Path"]')[0];
        });

        if (!targetTrigger) {
            throw new Error("Could not find Field Select dropdown in Property Panel.");
        }

        // --- First Change: Set to 'customer' ---
        console.log("Changing first column to 'customer'...");
        await targetTrigger.click();
        await page.waitForSelector('[role="option"]');
        await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const opt = options.find(o => o.textContent.trim() === 'customer');
            if (opt) opt.click();
        });

        // Wait for React to apply the update and re-render the left panel
        await new Promise(r => setTimeout(r, 800));

        // Verify
        let currentCount = await page.$$eval('table thead th', ths => ths.length);
        console.log(`Columns after 1st change (to 'customer'): ${currentCount}`);
        if (currentCount !== thCount) {
            throw new Error(`REGRESSION: Expected column count to remain ${thCount}, but got ${currentCount}`);
        }

        // --- Second Change: Set the SAME column to 'status' ---
        // If we didn't use array indexes for React keys `key={`${col.key}-${idx}`}`,
        // changing back and forth or having duplicates could trigger the bug the user saw.
        console.log("Changing first column to 'status'...");
        await targetTrigger.click();
        await page.waitForSelector('[role="option"]');
        await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const opt = options.find(o => o.textContent.trim() === 'status');
            if (opt) opt.click();
        });

        await new Promise(r => setTimeout(r, 800));

        currentCount = await page.$$eval('table thead th', ths => ths.length);
        console.log(`Columns after 2nd change (to 'status'): ${currentCount}`);
        if (currentCount !== thCount) {
            throw new Error(`REGRESSION: Expected column count to remain ${thCount}, but got ${currentCount}`);
        }

        console.log("TEST PASSED: No duplicate columns rendered during config mutations. The React unique key fix is working perfectly.");
    } catch (error) {
        console.error("Test failed:", error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
