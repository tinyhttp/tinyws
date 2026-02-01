import { it } from 'bun:test'
import * as assert from 'node:assert'
import { once } from 'node:events'
import { App, type Request } from '@tinyhttp/app'
import { type Server, type ServerOptions, WebSocket, WebSocketServer } from 'ws'
import { type TinyWSRequest, tinyws } from '../src/index'

const s = (handler: (req: TinyWSRequest) => void, opts?: ServerOptions, inst?: Server) => {
  const app = new App<Request & TinyWSRequest>()

  app.use('/ws', async (req) => {
    if (typeof req.ws !== 'undefined') {
      handler(req)
    }
  })

  return { app, opts, inst }
}

it('should respond with a message', async () => {
  const { app } = s(async (req) => {
    const ws = await req?.ws()

    return ws.send('hello there')
  })

  const server = app.listen(4443, undefined, 'localhost')
  tinyws(app, server)

  const ws = new WebSocket('ws://localhost:4443/ws')

  const [data] = await once(ws, 'message')

  assert.equal(data.toString(), 'hello there')
  ws.close()
  server.close()
})

it('should resolve a `.ws` property', async () => {
  const { app } = s(async (req) => {
    const ws = await req.ws()

    assert.ok(typeof ws.send === 'function')

    return ws.send('hello there')
  })

  const server = app.listen(4444, undefined, 'localhost')
  tinyws(app, server)

  const ws = new WebSocket('ws://localhost:4444/ws')

  ws.on('message', () => {
    server.close()
    ws.close()
  })
})

it('should pass ws options', async () => {
  const { app, opts } = s(
    async (req) => {
      const ws = await req.ws()

      assert.ok(typeof ws.send === 'function')

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
  tinyws(app, server, opts)

  const ws = new WebSocket('ws://localhost:4445/ws')

  await once(ws, 'message')

  ws.send('some lenghty message')

  server.close()
  ws.close()
})

it('should accept messages', async () => {
  const { app } = s(async (req) => {
    const ws = await req.ws()

    assert.ok(typeof ws.send === 'function')

    return ws.on('message', (msg) => ws.send(`You sent: ${msg}`))
  })

  const server = app.listen(4446, undefined, 'localhost')
  tinyws(app, server)

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
    assert.ok(typeof socket.send === 'function')
  })

  const { app, inst } = s(
    async (req) => {
      const ws = await req.ws()

      assert.ok(typeof ws.send === 'function')

      return ws.send('hello there')
    },
    {},
    wss
  )

  const server = app.listen(4447, undefined, 'localhost')
  tinyws(app, server, {}, inst)

  const ws = new WebSocket('ws://localhost:4447/ws')

  await once(ws, 'message')

  server.close()
  ws.close()
})

it('returns a WebSocketServer instance', () => {
  const app = new App()
  const server = app.listen(4448, undefined, 'localhost')
  const wss = tinyws(app, server)
  assert.ok(wss instanceof WebSocketServer)
  server.close()
})

it('restricts WebSocket to specified paths', async () => {
  const app = new App<Request & TinyWSRequest>()

  app.use('/ws', async (req, res) => {
    if (req.ws) {
      const ws = await req.ws()
      return ws.send('allowed')
    }
    res.send('no ws')
  })

  app.use('/other', async (req, res) => {
    if (req.ws) {
      const ws = await req.ws()
      return ws.send('should not happen')
    }
    res.send('no ws on other')
  })

  const server = app.listen(4449, undefined, 'localhost')
  tinyws(app, server, { paths: '/ws' })

  // Connection to /ws should work
  const ws1 = new WebSocket('ws://localhost:4449/ws')
  const [data] = await once(ws1, 'message')
  assert.equal(data.toString(), 'allowed')
  ws1.close()

  // Connection to /other should not have req.ws
  const ws2 = new WebSocket('ws://localhost:4449/other')
  const [err] = await once(ws2, 'error')
  assert.ok(err)
  ws2.close()

  server.close()
})

it('supports multiple paths', async () => {
  const app = new App<Request & TinyWSRequest>()

  app.use('/ws1', async (req) => {
    if (req.ws) {
      const ws = await req.ws()
      return ws.send('ws1')
    }
  })

  app.use('/ws2', async (req) => {
    if (req.ws) {
      const ws = await req.ws()
      return ws.send('ws2')
    }
  })

  const server = app.listen(4450, undefined, 'localhost')
  tinyws(app, server, { paths: ['/ws1', '/ws2'] })

  const ws1 = new WebSocket('ws://localhost:4450/ws1')
  const [data1] = await once(ws1, 'message')
  assert.equal(data1.toString(), 'ws1')
  ws1.close()

  const ws2 = new WebSocket('ws://localhost:4450/ws2')
  const [data2] = await once(ws2, 'message')
  assert.equal(data2.toString(), 'ws2')
  ws2.close()

  server.close()
})
