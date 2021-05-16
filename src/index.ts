import ws from 'ws'
import http from 'http'

export interface TinyWSRequest extends http.IncomingMessage {
  ws: () => Promise<ws>
}

/**
 * tinyws - adds `req.ws` method that resolves when websocket request appears
 * @param wsOptions
 */
export const tinyws = (wsOptions?: ws.ServerOptions, wsServerInstance?: ws.Server) => {
  const wss = wsServerInstance || new ws.Server({ ...wsOptions, noServer: true })

  return async (req: TinyWSRequest, _res, next: () => void | Promise<void>) => {
    const upgradeHeader = (req.headers.upgrade || '').split(',').map((s) => s.trim())

    // When upgrade header contains "websocket" it's index is 0
    if (upgradeHeader.indexOf('websocket') === 0) {
      req.ws = () =>
        new Promise((resolve) => {
          wss.handleUpgrade(req, req.socket, Buffer.alloc(0), resolve)
        })
    }

    await next()
  }
}
