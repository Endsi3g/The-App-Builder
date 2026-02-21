import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Browser Service
 * Handles connection to a Browserless instance for web scraping and capture.
 */
export async function capturePage(url) {
  const browserlessUrl = process.env.BROWSERLESS_URL || 'ws://localhost:3000';
  const token = process.env.BROWSERLESS_TOKEN;
  
  const connectUrl = token 
    ? `${browserlessUrl}?token=${token}`
    : browserlessUrl;

  console.log(`Connecting to browserless at ${browserlessUrl}...`);
  
  let browser;
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: connectUrl,
    });

    const page = await browser.newPage();
    
    // Set viewport for better rendering
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract page content and title
    const data = await page.evaluate(() => {
      return {
        title: document.title,
        content: document.body.innerText,
        html: document.documentElement.outerHTML
      };
    });

    await browser.close();
    return data;
  } catch (error) {
    console.error('Browserless Error:', error);
    if (browser) await browser.close();
    throw error;
  }
}
