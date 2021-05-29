<p align="center">
  <img src="https://raw.githubusercontent.com/talentlessguy/tinyws/master/logo.svg" alt="Logo">
</p>

# tinyws

![Vulnerabilities][vulns-badge-url]
[![Version][v-badge-url]][npm-url]
![Last commit][last-commit-badge-url]
![Minified size][size-badge-url] [![Downloads][dl-badge-url]][npm-url] [![GitHub Workflow Status][gh-actions-img]][github-actions] [![Codecov][cov-badge-url]][cov-url]

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

[vulns-badge-url]: https://img.shields.io/snyk/vulnerabilities/npm/tinyws.svg?style=flat-square
[v-badge-url]: https://img.shields.io/npm/v/tinyws.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/tinyws
[last-commit-badge-url]: https://img.shields.io/github/last-commit/talentlessguy/tinyws.svg?style=flat-square
[size-badge-url]: https://img.shields.io/bundlephobia/min/tinyws.svg?style=flat-square
[cov-badge-url]: https://img.shields.io/codecov/c/gh/talentlessguy/tinyws?style=flat-square
[cov-url]: https://codecov.io/gh/talentlessguy/tinyws
[dl-badge-url]: https://img.shields.io/npm/dt/tinyws?style=flat-square
[github-actions]: https://github.com/talentlessguy/tinyws/actions
[gh-actions-img]: https://img.shields.io/github/workflow/status/talentlessguy/tinyws/CI?style=flat-square
