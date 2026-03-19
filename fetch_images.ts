import https from 'https';

const items = [
  'Wolf', 'Bear', 'Red fox', 'Rabbit', 'Squirrel', 'Hedgehog', 'Deer', 'Moose', 'European badger',
  'Apple', 'Pear', 'Banana', 'Strawberry', 'Blueberry', 'Raspberry', 'Cherry', 'Plum', 'Grape',
  'Carrot', 'Potato', 'Cabbage', 'Cucumber', 'Tomato', 'Onion', 'Garlic', 'Bell pepper', 'Eggplant'
];

async function getImageUrl(title: string): Promise<string | null> {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=400`;
    const options = {
      headers: { 'User-Agent': 'EstonianGameApp/1.0 (erikegliens@gmail.com)' }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for (const item of items) {
    const url = await getImageUrl(item);
    console.log(`${item}: ${url}`);
  }
}

run();
