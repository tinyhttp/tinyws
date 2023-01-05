import polka, { Request } from 'polka'

import { tinyws, TinyWSRequest } from '../src/index'

const app = polka<Request & TinyWSRequest>()

app.use(tinyws())

app.use('/hmr', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello from polka@1.0')
  } else {
    res.end('Hello from HTTP!')
  }
})

app.listen(3000)
