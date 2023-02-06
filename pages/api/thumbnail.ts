import type { NextApiRequest, NextApiResponse } from 'next';
import chromium from 'chrome-aws-lambda';
import playwright from 'playwright-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const localChromePath = process.env.NODE_ENV !== 'development' ? '' : process.env.LOCAL_CHROME_PATH ?? '';
  if (process.env.NODE_ENV !== 'development') {
    const protocal = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PROT || '3000';
    const baseUrl = `${protocal}://${host}:${port}`;
    await chromium.font(`${baseUrl}/Pretendard-Regular.ttf`);
  }

  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: process.env.NODE_ENV !== 'development' ? await chromium.executablePath : localChromePath,
    headless: process.env.NODE_ENV !== 'development' ? chromium.headless : true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 675,
    },
  });

  const url = req.query.url as string;
  await page.goto(url);
  const data = await page.screenshot({ type: 'jpeg' });
  await browser.close();

  res.setHeader('cache-control', 'public, max-age=31536000');
  res.setHeader('content-type', 'image/jpeg');
  res.end(data);
}
