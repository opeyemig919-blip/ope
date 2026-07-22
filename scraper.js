const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Extracts the 32-char extension ID from any Chrome Web Store URL
function extractExtensionId(url) {
  const match = url.match(/[a-z]{32}/i);
  return match ? match[0] : null;
}

function isChromeStoreLink(url) {
  return /chromewebstore\.google\.com|chrome\.google\.com\/webstore/i.test(url);
}

async function fetchExtensionData(url) {
  const id = extractExtensionId(url);
  if (!id) throw new Error('Could not find a valid extension ID in that link.');

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
    }
  });

  if (!res.ok) throw new Error(`Store page returned ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const name =
    $('meta[property="og:title"]').attr('content') ||
    $('title').first().text().split('-')[0].trim() ||
    'Unknown extension';

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    'No description found.';

  const image = $('meta[property="og:image"]').attr('content') || null;

  // Rating / users are rendered client-side on the new store — best effort only.
  const bodyText = $('body').text();
  const ratingMatch = bodyText.match(/(\d\.\d{1,2})\s*(?:stars|★)/i);
  const usersMatch = bodyText.match(/([\d,]+)\+?\s*users/i);

  return {
    id,
    url,
    name: name.trim(),
    description: description.trim().slice(0, 220),
    image,
    rating: ratingMatch ? ratingMatch[1] : 'N/A',
    users: usersMatch ? usersMatch[1] : 'N/A'
  };
}

module.exports = { extractExtensionId, isChromeStoreLink, fetchExtensionData };
