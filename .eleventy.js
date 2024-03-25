const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');
const syncRequest = require('sync-request');

module.exports = function (eleventyConfig) {
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
    const countries = [...new Set(events.map(event => event.country))];

    const countriesWithContinents = countries.map(country => {
      const continent = getContinent(country);
      return { country, continent };
    });

    events.forEach((event) => {
        event.continent = countriesWithContinents.find(c => c.country === event.country).continent;
    });

    return JSON.stringify(events, null, null);
  });

  /* CI ADDS MINIFIER PLUGIN HERE */
};


function makeSyncGETRequest(url) {
    const response = syncRequest('GET', url);
    return response.getBody('utf8');
}

function getContinent(country) {
  const url = `https://restcountries.com/v3.1/name/${country}`;

  const response = makeSyncGETRequest(url);
  const data = JSON.parse(response);

  return data[0].continents[0];
}
