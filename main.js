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

  const file = fs.createWriteStream(hostname);

  protocol.get(link, (res) => {
    res.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${hostname}`);
    });
  }).on('error', () => {
    console.log(`Error downloading ${link}`);
  });

  file.on('error', () => {
    console.log(`Error writing file for ${hostname}`);
  });
});
