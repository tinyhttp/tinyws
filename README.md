<p align="center">
  <img src="logo.svg" alt="Logo">
</p>

# tinyws

![Vulnerabilities][vulns-badge-url]
[![Version][v-badge-url]][npm-url]
![Last commit][last-commit-badge-url]
![Minified size][size-badge-url] [![Downloads][dl-badge-url]][npm-url] [![GitHub Workflow Status][gh-actions-img]][github-actions] [![Codecov][cov-badge-url]][cov-url]

Tiny WebSocket middleware for Node.js based on [ws](https://github.com/websockets/ws). Inspired by [koa-easy-ws](https://github.com/b3nsn0w/koa-easy-ws).

## Features

- Small size (**498B**)
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

[vulns-badge-url]: https://img.shields.io/snyk/vulnerabilities/npm/tinyws.svg?style=flat-square
[v-badge-url]: https://img.shields.io/npm/v/tinyws.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/tinyws
[last-commit-badge-url]: https://img.shields.io/github/last-commit/talentlessguy/tinyws.svg?style=flat-square
[size-badge-url]: https://img.shields.io/bundlephobia/min/tinyws.svg?style=flat-square
[cov-badge-url]: https://img.shields.io/codecov/c/gh/talentlessguy/tinyws?style=flat-square
[cov-url]: https://codecov.io/gh/talentlessguy/tinyws
[dl-badge-url]: https://img.shields.io/npm/dt/tinyws?style=flat-square
[github-actions]: https://github.com/talentlessguy/tinyws/actions
[gh-actions-img]: https://img.shields.io/github/workflow/status/talentlessguy/tinyhttp/CI?style=flat-square
