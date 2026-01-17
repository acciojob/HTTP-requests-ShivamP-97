const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.log('Error: No URLs provided');
  process.exit(0);
}

urls.forEach((link) => {
  let hostname;
  try {
    const parsed = new URL(link);
    hostname = parsed.hostname;
  } catch {
    console.log(`Invalid URL: ${link}`);
    return;
  }

  const protocol = link.startsWith('https') ? https : http;
  const options = { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } };

  protocol.get(link, options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      fs.writeFile(hostname, data, (err) => {
        if (err) {
          console.log(`Error writing file for ${hostname}`);
        } else {
          console.log(`Downloaded: ${hostname}`);
        }
      });
    });
  }).on('error', () => {
    console.log(`Error downloading ${link}`);
  });
});
