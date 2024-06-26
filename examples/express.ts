import * as express from 'express'
import type { WebSocket } from 'ws'
import { tinyws } from '../src/index'

declare global {
  namespace Express {
    export interface Request {
      ws: () => Promise<WebSocket>
    }
  }
}

const app = express()

app.use('/hmr', tinyws(), async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello from express@4')
  }
  res.send('Hello from HTTP!')
})

app.listen(3000)
