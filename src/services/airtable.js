const Airtable = require('airtable');

const base = new Airtable({ apiKey: 'keyHfmlr2rxB2ud1t' }).base('appqSBWD4oz7GmTww');

module.exports = {
  getSprint: async () => {
    const b = await base('Sprints').select({
      view: 'Grid view',
      filterByFormula: 'SEARCH("Sprint 1",target)',
    });
    // eslint-disable-next-line no-underscore-dangle
    return b.firstPage().then(r => r[0]._rawJson.fields);
  },
};
