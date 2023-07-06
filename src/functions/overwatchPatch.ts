import https from 'node:https';
import { ulid } from "ulid";
import { OverPatchDB } from '../db/overpatch.js';

export const PatchApi = async () => {
  const options = {
    hostname: 'overwatch.blizzard.com',
    path: `/en-us/news/patch-body/live/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/`
  }

  return new Promise(resolve => {
    let data = [];

    https.get(options, res => {
      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => {
        const html = Buffer.concat(data).toString();
        const patchDates = html.match(/patch-+\d{4}-+\d{2}-+\d{2}/g);

        resolve(patchDates[0].replace('patch-', ''));
      });
    });
  });
}