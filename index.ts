import { httpServer } from './src/http_server/index.js';
import WsServer from './src/ws_server.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

new WsServer().start();
