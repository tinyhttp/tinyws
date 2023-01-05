import { App, Request } from '@tinyhttp/app'
import { WebSocket } from 'ws'
import { tinyws, TinyWSRequest } from '../../src/index'

const app = new App<any, Request & TinyWSRequest>()

app.use(tinyws())

let connections: WebSocket[] = []

app.use('/chat', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    connections.push(ws)

    ws.on('message', (message) => {
      console.log('Received message:', message)

      // broadcast
      connections.forEach((socket) => socket.send(message))
    })

    ws.on('close', () => (connections = connections.filter((conn) => (conn === ws ? false : true))))
  }
})

app.listen(3000)
