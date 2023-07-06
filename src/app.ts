import { 
    MatrixClient,
    SimpleFsStorageProvider,
    RustSdkCryptoStorageProvider,
    AutojoinRoomsMixin,
} from "matrix-bot-sdk";

import randn_bm from './functions/iqtest';
import { ShopApi } from './functions/overwatchShop';
import { config } from './config';

// This will be the URL where clients can reach your homeserver. Note that this might be different
// from where the web/chat interface is hosted. The server must support password registration without
// captcha or terms of service (public servers typically won't work).
const homeserverUrl = "https://matrix.org";

// Use the access token you got from login or registration above.
const accessToken = config.token;

// In order to make sure the bot doesn't lose its state between restarts, we'll give it a place to cache
// any information it needs to. You can implement your own storage provider if you like, but a JSON file
// will work fine for this example.
const storageProvider = new SimpleFsStorageProvider("./bot.json"); // or any other IStorageProvider
const cryptoProvider = new RustSdkCryptoStorageProvider("./crypto");

// Finally, let's create the client and set it to autojoin rooms. Autojoining is typical of bots to ensure
// they can be easily added to any room.
const client = new MatrixClient(homeserverUrl, accessToken, storageProvider, cryptoProvider);
AutojoinRoomsMixin.setupOnClient(client);

// Before we start the bot, register our command handler
client.on("room.message", async (roomId: string, event: any) => {
    // Don't handle unhelpful events (ones that aren't text messages, are redacted, or sent by us)
    if (event['content']?.['msgtype'] !== 'm.text') return;
    if (event['sender'] === await client.getUserId()) return;
    
    // Check to ensure that the `!hello` command is being run
    const body = event['content']['body'];
    if (body?.startsWith("!iq")) {
        // Now that we've passed all the checks, we can actually act upon the command
        await client.replyNotice(roomId, event, `Your IQ is ${randn_bm(75, 145, 1)}`);
    };

    if (body?.startsWith("!shop")) {
        const result: any = await ShopApi('ko-KR');

        // Now that we've passed all the checks, we can actually act upon the command
        await client.sendHtmlText(roomId, '<h1>Overwatch 2 Shop</h1><ul>\n' + result.items + '</ul>');
    };
});

// Now that everything is set up, start the bot. This will start the sync loop and run until killed.
client.start().then(() => console.log("Bot started!"));