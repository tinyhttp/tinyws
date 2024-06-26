import { it } from 'bun:test'
import * as assert from 'node:assert'
import { once } from 'node:events'
import { App, type Request } from '@tinyhttp/app'
import { type Server, type ServerOptions, WebSocketServer } from 'ws'
import { type TinyWSRequest, tinyws } from '../src/index'

const s = (handler: (req: TinyWSRequest) => void, opts?: ServerOptions, inst?: Server) => {
  const app = new App<Request & TinyWSRequest>()

  app.use(tinyws(opts, inst))
  app.use('/ws', async (req) => {
    if (typeof req.ws !== 'undefined') {
      handler(req)
    }
  })

  return app
}

it('should respond with a message', async () => {
  const app = s(async (req) => {
    const ws = await req?.ws()

    return ws.send('hello there')
  })

  const server = app.listen(4443, undefined, 'localhost')

  const ws = new WebSocket('ws://localhost:4443/ws')

  const [data] = await once(ws, 'message')

  assert.equal(data.toString(), 'hello there')
  ws.close()
  server.close()
})

it('should resolve a `.ws` property', async () => {
  const app = s(async (req) => {
    const ws = await req.ws()

    assert.ok(ws instanceof WebSocket)

    return ws.send('hello there')
  })

  const server = app.listen(4444, undefined, 'localhost')

  const ws = new WebSocket('ws://localhost:4444/ws')

  ws.on('message', () => {
    server.close()
    ws.close()
  })
})

it('should pass ws options', async () => {
  const app = s(
    async (req) => {
      const ws = await req.ws()

      assert.ok(ws instanceof WebSocket)

      ws.on('error', (err) => {
        assert.match(err.message, /Max payload size exceeded/)
      })

      return ws.send('hello there')
    },
    {
      maxPayload: 2
    }
  )

  const server = app.listen(4445, undefined, 'localhost')

  const ws = new WebSocket('ws://localhost:4445/ws')

  await once(ws, 'message')

  ws.send('some lenghty message')

  server.close()
  ws.close()
})

it('should accept messages', async () => {
  const app = s(async (req) => {
    const ws = await req.ws()

    assert.ok(ws instanceof WebSocket)

    return ws.on('message', (msg) => ws.send(`You sent: ${msg}`))
  })

  const server = app.listen(4446, undefined, 'localhost')

  const ws = new WebSocket('ws://localhost:4446/ws')

  await once(ws, 'open')

  ws.send('42')

  const [data] = await once(ws, 'message')

  assert.equal(data.toString(), 'You sent: 42')

  server.close()
  ws.close()
})

it('supports passing a server instance', async () => {
  const wss = new WebSocketServer({ noServer: true })

  wss.on('connection', (socket) => {
    assert.ok(socket instanceof WebSocket)
  })

  const app = s(
    async (req) => {
      const ws = await req.ws()

      assert.ok(ws instanceof WebSocket)

      return ws.send('hello there')
    },
    {},
    wss
  )

  const server = app.listen(4447, undefined, 'localhost')

  const ws = new WebSocket('ws://localhost:4447/ws')

  await once(ws, 'message')

  server.close()
  ws.close()
})

it('returns a middleware function', () => {
  assert.ok(typeof tinyws() === 'function')
})
