<p align="center">
  <img src="logo.svg" alt="Logo">
</p>

# tinyws

Tiny WebSocket middleware for Node.js based on [ws](https://github.com/websockets/ws). Inspired by [koa-easy-ws](https://github.com/b3nsn0w/koa-easy-ws).

## Features

- Small size (**327B**)
- Easy to use (only `req.ws` and nothing else)
- Framework-agnostic (works with tinyhttp, express etc)
- Written in TypeScript

## Install

```sh
pnpm i ws tinyws
```

## Example

```ts
import { App, Request } from '@tinyhttp/app'
import { tinyws, TinyWSRequest } from 'tinyws'

const app = new App<any, Request & TinyWSRequest>()

app.use(tinyws())

app.use('/ws', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    return ws.send('hello there')
  } else {
    res.send('Hello from HTTP!')
  }
})

app.listen(3000)
```
