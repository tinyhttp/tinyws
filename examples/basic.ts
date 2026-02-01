import { App, type Request } from '@tinyhttp/app'

import { type TinyWSRequest, tinyws } from '../src/index'

const app = new App<Request & TinyWSRequest>()

app.use('/hmr', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello there')
  }
  res.send('Hello from HTTP!')
})

const server = app.listen(3000)
tinyws(app, server)
