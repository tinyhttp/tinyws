import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { App, Request, Handler } from '@tinyhttp/app'
import { tinyws, TinyWSRequest } from '../src/index'
import { once } from 'events'
import WebSocket from 'ws'
import { Server } from 'http'

const t = suite('tinyws')

const s = (handler: (req: TinyWSRequest) => void) => {
  const app = new App<any, Request & TinyWSRequest>()

  app.use(tinyws())
  app.use('/ws', async (req, res, next) => {
    if (req.ws) {
      handler(req)
    }
  })

  return app
}

t('should respond with a message', async () => {
  const app = s(async (req) => {
    const ws = await req.ws()

    return ws.send('hello there')
  })

  const server = app.listen(4444)

  const ws = new WebSocket('ws://localhost:4444/ws')

  const data = await once(ws, 'message')

  assert.equal(data.toString(), 'hello there')
  server.close()
  ws.close()
})

t('should resolve a `.ws` property', async () => {
  const app = s(async (req) => {
    const ws = await req.ws()

    assert.instance(ws, WebSocket)

    return ws.send('hello there')
  })

  const server = app.listen(4444)

  const ws = new WebSocket('ws://localhost:4444/ws')

  await once(ws, 'message')

  server.close()
  ws.close()
})

t.run()
