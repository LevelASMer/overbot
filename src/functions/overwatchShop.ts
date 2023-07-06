import https from 'node:https';

export const ShopApi = async (lang: string) => {
  const options = {
    hostname: 'kr.shop.battle.net',
    path: '/api/itemshop/overwatch/pages/6a011f23-5874-4df5-a38f-1086f6c636f6' +
      `?userId=0&locale=${lang}`,
    headers: {
      'Accept-Language': lang
    }
  }

  return new Promise(resolve => {
    let data: any = [];

    https.get(options, res => {
      res.on('data', (chunk: any) => {
        data.push(chunk);
      });

      res.on('end', () => {
        let itemsData = "";
        const json = JSON.parse(Buffer.concat(data).toString());

        for (const i of json.mtxCollections[0].items) {
          itemsData += `<li>${i.title}: ${Math.floor(i.price.raw)} Coin</li>\n`
        }
        
        resolve({
          id: json.id,
          items: itemsData.substr(0, itemsData.length - 1)
        });
      });
    });
  });
}
