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

  // open auth modal by clicking signup
  await page.waitForSelector('button', {timeout:5000});
  // try to click "Sign up" or "Sign in" link in nav
  const signupLink = await page.$x("//button[contains(., 'Sign up') or contains(., 'Sign In') or contains(., 'Log in') or contains(., 'Sign In')]");
  if (signupLink.length) {
    console.log('Clicking nav signup link');
    await signupLink[0].click();
    await page.waitForTimeout(500);
  }
  // check for modal
  const modalExists = await page.$('.auth-modal') || await page.$('form');
  console.log('Auth modal present?', !!modalExists);

  // try sign up flow if modal form has signup
  const emailInput = await page.$('input[type=email]');
  if (emailInput) {
    console.log('Filling signup form');
    await emailInput.type('test@example.com');
    const password = await page.$('input[type=password]');
    await password.type('password');
    const btn = await page.$('button[type=submit]');
    if (btn) {
      await btn.click();
      await page.waitForTimeout(1000);
    }
  }

  // navigate to dashboard route
  console.log('Navigating to /dashboard');
  await page.goto(base + '/dashboard', { waitUntil: 'networkidle0' });
  console.log('Dashboard text snippet:', await page.evaluate(() => document.body.innerText.slice(0,200)));

  // scan page
  console.log('Navigating to /scan');
  await page.goto(base + '/scan', { waitUntil: 'networkidle0' });
  console.log('Scan page loaded');
  await page.waitForTimeout(500);

  // camera page tested by clicking start scan
  const cameraButton = await page.$('button');
  if (cameraButton) {
    // maybe on scan page there is capture overlay clickable? we won't simulate capturing
  }

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
