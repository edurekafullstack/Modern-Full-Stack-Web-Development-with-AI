import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const [url = 'http://localhost:4173/login', label = 'baseline'] = process.argv.slice(2);
if (!/^[a-z0-9_-]+$/i.test(label)) throw new Error('Use a simple report label');
const perfDir = path.resolve('perf');
await fs.mkdir(perfDir, { recursive: true });
const results = [];
const median = values => [...values].sort((a,b) => a-b)[1];
for (let i = 0; i < 3; i++) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run'] });
  try {
    const { lhr, report } = await lighthouse(url, {
      port: chrome.port,
      onlyCategories: ['performance'],
      output: 'html',
      logLevel: 'error',
    });
    const scripts = (lhr.audits['network-requests']?.details?.items ?? [])
      .filter(item => item.resourceType === 'Script');
    const metrics = {
      score: Math.round((lhr.categories.performance.score ?? 0) * 100),
      fcp: lhr.audits['first-contentful-paint'].numericValue / 1000,
      lcp: lhr.audits['largest-contentful-paint'].numericValue / 1000,
      tbt: lhr.audits['total-blocking-time'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      javascriptFiles: scripts.length,
      javascriptKiB: scripts.reduce((sum, item) => sum + (item.transferSize ?? 0), 0) / 1024,
    };
    results.push({ metrics, report });
  } finally {
    await chrome.kill();
  }
}
const keys = Object.keys(results[0].metrics);
const medians = Object.fromEntries(keys.map(key => [key, median(results.map(r => r.metrics[key]))]));
const sortedByLcp = [...results].sort((a,b) => a.metrics.lcp - b.metrics.lcp);
await fs.writeFile(path.join(perfDir, `${label}.html`), sortedByLcp[1].report);
await fs.writeFile(path.join(perfDir, `${label}.json`), JSON.stringify({ url, runs: results.map(r => r.metrics), medians }, null, 2));
console.log(`${label}: median of 3 runs for ${url}`);
console.table(medians);
console.log(`Reports saved to perf/${label}.html and perf/${label}.json`);
