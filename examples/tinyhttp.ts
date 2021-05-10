import { App, Request } from '@tinyhttp/app'

import { tinyws, TinyWSRequest } from '../src/index'

const app = new App<any, Request & TinyWSRequest>()

app.use(tinyws())

app.use('/hmr', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello there')
  } else {
    res.send('Hello from HTTP!')
  }
})

app.listen(3000)
