import * as polka from 'polka'

import { type TinyWSRequest, tinyws } from '../src/index'

const app = polka<polka.Request & TinyWSRequest>()

app.use(tinyws())

app.use('/hmr', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello from polka@1.0')
  }
  res.end('Hello from HTTP!')
})

app.listen(3000)
