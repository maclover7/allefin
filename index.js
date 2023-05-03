const { readFile, writeFile } = require('fs/promises');

const getAllFilings = () => {
  return fetch("https://documents.alleghenycounty.us/PAVNextGen/api/CustomQuery/KeywordSearch", {
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      Keywords: [{ ID: 393, Value: 2023, KeywordOperator: "=" }],
      QueryID: 136
    }),
    method: "POST"
  })
    .then((r) => r.json())
    .then((r) => Promise.resolve(r.Data.map((filing) => filing.Name)));
};

const getKnownFilings = () => readFile('filings.json').then(JSON.parse);

Promise.all([getAllFilings(), getKnownFilings()])
  .then(([filings, knownFilings]) => {
    const newFilings = filings.filter((filing) => !knownFilings.includes(filing));
    newFilings.forEach((f) => console.log(f));

    return writeFile(
      'filings.json',
      JSON.stringify(filings.concat(newFilings))
    )
      .then(() => {
        console.log('done')
      });
  });
