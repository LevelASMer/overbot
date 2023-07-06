import { MatrixAuth } from "matrix-bot-sdk";
import { config } from './config';

// This will be the URL where clients can reach your homeserver. Note that this might be different
// from where the web/chat interface is hosted. The server must support password registration without
// captcha or terms of service (public servers typically won't work).
const homeserverUrl = "https://matrix.org";

const auth = new MatrixAuth(homeserverUrl);
const client = await auth.passwordLogin(config.username, config.password);

console.log("Copy this access token to your bot's config: ", client.accessToken);