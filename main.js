const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeSocialMediaLinks(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const socialMediaLinks = {};

    // Social media platforms to scrape
    const socialMediaPlatforms = [
      'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube',
      'Snapchat', 'Pinterest', 'Reddit', 'TikTok', 'WhatsApp',
      'WeChat', 'Telegram', 'Tumblr', 'Quora', 'Flickr',
      'Vimeo', 'VKontakte (VK)', 'Weibo', 'Line', 'KakaoTalk'
    ];

    socialMediaPlatforms.forEach(platform => {
      const platformRegex = new RegExp(platform, 'i');
      $('a[href]').each((index, element) => {
        const href = $(element).attr('href');
        if (href && href.match(platformRegex)) {
          socialMediaLinks[platform] = href;
        }
      });
    });

    return socialMediaLinks;
  } catch (error) {
    console.error('Error scraping social media links:', error.message);
    return null;
  }
}

async function scrapeAllWebsites(websitesFilePath) {
  try {
    const websites = fs.readFileSync(websitesFilePath, 'utf-8').split('\n').map(website => website.trim());
    const socialMediaLinksList = [];

    for (const website of websites) {
      const socialMediaLinks = await scrapeSocialMediaLinks(website);
      if (socialMediaLinks) {
        socialMediaLinksList.push({ website, socialMediaLinks });
      }
    }

    return socialMediaLinksList;
  } catch (error) {
    console.error('Error scraping websites:', error.message);
    return null;
  }
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the file name containing the list of websites: ', async (websitesFilePath) => {
    rl.close();
    const socialMediaLinksList = await scrapeAllWebsites(websitesFilePath.trim());
  
    if (socialMediaLinksList) {
      const outputFilePath = 'output.json';
      const outputData = JSON.stringify(socialMediaLinksList, null, 2);
      fs.writeFileSync(outputFilePath, outputData);
      console.log('Output saved to', outputFilePath);
    }
  });
}

main();
