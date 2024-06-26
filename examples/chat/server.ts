import { App, type Request } from '@tinyhttp/app'
import type { WebSocket } from 'ws'
import { type TinyWSRequest, tinyws } from '../../src/index'

const app = new App<Request & TinyWSRequest>()

app.use(tinyws())

let connections: WebSocket[] = []

app.use('/chat', async (req) => {
  if (req.ws) {
    const ws = await req.ws()

    connections.push(ws)

    ws.on('message', (message) => {
      console.log('Received message:', message)

      // broadcast
      // biome-ignore lint/complexity/noForEach: <explanation>
      connections.forEach((socket) => socket.send(message))
    })

    ws.on('close', () => (connections = connections.filter((conn) => conn !== ws)))
  }
})

app.listen(3000)
