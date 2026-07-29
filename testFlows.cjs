const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  const base = 'http://localhost:5173';
  console.log('Navigating to landing');
  await page.goto(base, { waitUntil: 'networkidle0' });
  console.log('Landing title:', await page.title());

  // test landing content
  const navText = await page.evaluate(() => document.body.innerText);
  console.log('Landing text snippet:', navText.slice(0, 200));

  // open auth modal by clicking signup/signin in nav
  // open the auth modal via the custom event (click sometimes unreliable headless)
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('openAuth', { detail: { mode: 'signin' } }));
  });
  // wait for modal to appear
  await page.waitForSelector('.modal-bg', {timeout:5000});
  console.log('Auth modal present? yes');

  // try sign up flow if modal form is displayed
  const emailInput = await page.$('input[type=email]');
  if (emailInput) {
    console.log('Filling signup form');
    await emailInput.type('test@example.com');
    const password = await page.$('input[type=password]');
    await password.type('password');
    const btn = await page.$('button.modal-btn');
    if (btn) {
      await btn.click();
      await page.waitForSelector('.modal-bg', {hidden: true, timeout:5000}).catch(() => {});
    }
  }

  // after signup, check that user is stored locally
  const stored = await page.evaluate(() => localStorage.getItem('glowmouth_user'));
  console.log('Local storage user after signup:', stored);

  // navigate to dashboard route
  console.log('Navigating to /dashboard');
  await page.goto(base + '/dashboard', { waitUntil: 'networkidle0' });
  console.log('Dashboard text snippet:', await page.evaluate(() => document.body.innerText.slice(0,200)));

  // scan page
  console.log('Navigating to /scan');
  await page.goto(base + '/scan', { waitUntil: 'networkidle0' });
  console.log('Scan page loaded');

  // direct navigate to results and history to ensure pages render
  console.log('Navigating to /results');
  await page.goto(base + '/results', { waitUntil: 'networkidle0' }).catch(() => {});
  console.log('Results page snippet:', await page.evaluate(() => document.body.innerText.slice(0,200)));

  console.log('Navigating to /history');
  await page.goto(base + '/history', { waitUntil: 'networkidle0' }).catch(() => {});
  console.log('History page snippet:', await page.evaluate(() => document.body.innerText.slice(0,200)));

  console.log('Testing unknown route');
  await page.goto(base + '/thispagedoesnotexist', { waitUntil: 'networkidle0' }).catch(() => {});
  console.log('Unknown route snippet:', await page.evaluate(() => document.body.innerText.slice(0,200)));

  await browser.close();
})();
