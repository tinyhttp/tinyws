import express from 'express'
import ws from 'ws'
import { tinyws } from '../src/index'

export {}

declare global {
  namespace Express {
    export interface Request {
      ws: () => Promise<ws>
    }
  }
}

const app = express()

app.use('/hmr', tinyws(), async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello from express@4')
  } else {
    res.send('Hello from HTTP!')
  }
})

app.listen(3000)
