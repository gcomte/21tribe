const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');

module.exports = function (eleventyConfig) {
  // Add a shortcode to read and dump file content
  eleventyConfig.addShortcode('dumpConferenceData', function () {
    const conferenceDataPath = '_data/conferences/';
    const files = fs.readdirSync(conferenceDataPath);

    let yamlData = '';

    files.forEach((file) => {
      const filePath = path.join(process.cwd(), conferenceDataPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8').trim();
      yamlData += `${fileContent}\n`;
    });

    var events = jsyaml.load(yamlData);

    return JSON.stringify(events, null, 2);
  });
};
