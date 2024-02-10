const fs = require('fs');

function extractSocialLinks(jsonFilePath, socialPlatforms) {
  try {
    // Read the contents of the JSON file
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    const socialMediaLinksList = JSON.parse(data);

    // Initialize an object to store social media links
    const socialMediaLinks = {};

    // Iterate over each entry in the JSON data
    socialMediaLinksList.forEach(entry => {
      const { website, socialMediaLinks: entryLinks } = entry;
      
      // Iterate over each social media platform specified
      socialPlatforms.forEach(platform => {
        // Check if the platform exists in the entry
        if (platform in entryLinks) {
          // Initialize an array for the platform if not already present
          if (!socialMediaLinks[platform]) {
            socialMediaLinks[platform] = [];
          }
          // Push the link to the corresponding platform array
          socialMediaLinks[platform].push(entryLinks[platform]);
        }
      });
    });

    return socialMediaLinks;
  } catch (error) {
    console.error('Error extracting social media links:', error.message);
    return null;
  }
}

function saveSocialLinksToFile(socialMediaLinks, outputFilePath) {
  try {
    // Flatten the social media links object into an array of strings
    const socialLinksArray = Object.entries(socialMediaLinks).flatMap(([platform, links]) => {
      return links.map(link => `${platform}: ${link}`);
    });

    // Save the social media links to a file
    fs.writeFileSync(outputFilePath, socialLinksArray.join('\n'));
    console.log('Social Media Links saved to', outputFilePath);
  } catch (error) {
    console.error('Error saving social media links:', error.message);
  }
}

// Specify the JSON file containing the social media links and the output file path
const jsonFilePath = 'output.json';
const outputFilePath = 'social.txt';

// Specify the social media platforms to extract
const socialPlatforms = [
  'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube',
  'Snapchat', 'Pinterest', 'Reddit', 'TikTok', 'WhatsApp',
  'WeChat', 'Telegram', 'Tumblr', 'Quora', 'Flickr',
  'Vimeo', 'VKontakte (VK)', 'Weibo', 'Line', 'KakaoTalk'
];

// Extract social media links from the JSON file
const socialMediaLinks = extractSocialLinks(jsonFilePath, socialPlatforms);

// Save the extracted social media links to a file
if (socialMediaLinks) {
  saveSocialLinksToFile(socialMediaLinks, outputFilePath);
}
