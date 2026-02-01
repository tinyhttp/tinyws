import * as polka from 'polka'

import { type TinyWSRequest, tinyws } from '../src/index'

const app = polka<polka.Request & TinyWSRequest>()

app.use('/hmr', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello from polka@1.0')
  }
  res.end('Hello from HTTP!')
})

const server = app.listen(3000)
tinyws({ handler: app.handler }, server)
