import WebSocket from 'ws';

export function sendMessage(
  socket: WebSocket,
  type: string,
  data: object,
) {
  socket.send(
    JSON.stringify({
      type,
      data: JSON.stringify(data),
      id: 0,
    }),
  );
}