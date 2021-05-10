import express from 'express'

import { tinyws } from '../src/index'

const app = express()

// @ts-ignore
app.use('/', tinyws())

app.use('/hmr', async (req, res) => {
  // @ts-ignore
  if (req.ws) {
    // @ts-ignore
    const ws = await req.ws()

    return ws.send('hello there')
  } else {
    res.send('Hello from HTTP!')
  }
})

app.listen(3000)
