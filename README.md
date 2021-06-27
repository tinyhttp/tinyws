<div align="center">
<img src="https://raw.githubusercontent.com/tinyhttp/tinyws/master/logo.svg" alt="tinyws">
<p><sub>🚡 tiny WebSocket middleware for Node.js</sub></p>
<br />

[![Version][v-badge-url]][npm-url] [![Downloads][dl-badge-url]][npm-url] [![GitHub Workflow Status][gh-actions-img]][github-actions] [![Codecov][cov-badge-url]][cov-url]

</div>

_**tinyws**_ is a WebSocket middleware for Node.js based on [ws](https://github.com/websockets/ws), inspired by [koa-easy-ws](https://github.com/b3nsn0w/koa-easy-ws).

Check the [chat example](examples/chat) out to get familiar with tinyws.

## Features

- Small size (**498B**)
- Easy to use (only `req.ws` and nothing else)
- Framework-agnostic (works with tinyhttp, express etc)
- Written in TypeScript
- Pure ESM

## Why not [express-ws](https://github.com/HenningM/express-ws)?

because express-ws is...

- [Abandoned](https://github.com/HenningM/express-ws/issues/135) since 2018 💀
- Doesn't come with types out of the box (have to install `@types/express-ws`)
- Not compatible with tinyhttp and polka
- Buggy as hell
- Doesn't have tests

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

[v-badge-url]: https://img.shields.io/npm/v/tinyws.svg?style=for-the-badge&color=F55A5A&label=&logo=npm
[npm-url]: https://www.npmjs.com/package/tinyws
[cov-badge-url]: https://img.shields.io/coveralls/github/tinyhttp/tinyws?style=for-the-badge&color=F55A5A
[cov-url]: https://coveralls.io/github/tinyhttp/tinyws
[dl-badge-url]: https://img.shields.io/npm/dt/tinyws?style=for-the-badge&color=F55A5A
[github-actions]: https://github.com/tinyhttp/tinyws/actions
[gh-actions-img]: https://img.shields.io/github/workflow/status/tinyhttp/tinyws/CI?style=for-the-badge&color=F55A5A&label=&logo=github
