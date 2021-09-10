import { app } from './app';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import './config/database';

const http = createServer(app);
export const io = new Server(http);
import { SocketServer } from './config/socket';

io.on('connection', (socket: Socket) => SocketServer(socket));

const PORT = 1000;

http.listen(PORT, () =>
  console.log(`Server is running in port: http://localhost:${PORT}`)
);
