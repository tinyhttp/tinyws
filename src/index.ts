import * as http from 'node:http'
import type { Socket } from 'node:net'
import type { ServerOptions, WebSocket } from 'ws'
import { WebSocketServer } from 'ws'

export interface TinyWSRequest extends http.IncomingMessage {
  ws: () => Promise<WebSocket>
}

export interface TinyWSOptions extends ServerOptions {
  paths?: string | string[]
}

/**
 * tinyws - adds `req.ws` method that resolves when websocket request appears
 * @param app - The application instance with a handler function
 * @param server - The HTTP server instance
 * @param options - Optional WebSocket server options and paths to restrict WebSocket handling
 * @param wss - Optional existing WebSocketServer instance
 * @returns The WebSocketServer instance
 */
export const tinyws = (
  app: { handler: (req: any, res: any) => void },
  server: http.Server,
  options?: TinyWSOptions,
  wss: WebSocketServer = new WebSocketServer({ ...options, noServer: true })
) => {
  const { paths, ...wsOptions } = options || {}
  const allowedPaths = paths ? (Array.isArray(paths) ? paths : [paths]) : null

  const upgradeHandler = (request: http.IncomingMessage, socket: Socket, head: Buffer) => {
    const response = new http.ServerResponse(request)
    response.assignSocket(socket)

    // Copy the head buffer to avoid keeping the entire slab buffer alive
    const copyOfHead = Buffer.alloc(head.length)
    head.copy(copyOfHead)

    response.on('finish', () => {
      if (response.socket !== null) {
        response.socket.destroy()
      }
    })

    const upgradeHeader = (request.headers.upgrade || '').split(',').map((s) => s.trim())
    const requestPath = request.url?.split('?')[0] || '/'

    const pathMatches = allowedPaths === null || allowedPaths.some((p) => requestPath.startsWith(p))

    if (upgradeHeader.indexOf('websocket') === 0 && pathMatches) {
      ;(request as TinyWSRequest).ws = () =>
        new Promise((resolve) => {
          wss.handleUpgrade(request, socket, copyOfHead, (ws) => {
            wss.emit('connection', ws, request)
            resolve(ws)
          })
        })
    }

    app.handler(request, response)
  }

  server.on('upgrade', upgradeHandler)
  return wss
}
