import { App, type Request } from '@tinyhttp/app'

import { type TinyWSRequest, tinyws } from '../src/index'

const app = new App<Request & TinyWSRequest>()

app.use(tinyws())

app.use('/hmr', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello there')
  }
  res.send('Hello from HTTP!')
})

app.listen(3000)
