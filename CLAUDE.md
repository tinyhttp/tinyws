# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

tinyws is a minimal WebSocket middleware for Node.js based on the `ws` library. It adds a `req.ws()` method to requests that resolves to a WebSocket connection when an upgrade request is received. Framework-agnostic (works with tinyhttp, express, polka).

## Commands

- **Build**: `pnpm build` - Compiles TypeScript to `dist/`
- **Test**: `bun test` - Runs tests with Bun's test runner (tests use `bun:test`)
- **Test with coverage**: `pnpm test:coverage` - Runs tests with c8 coverage
- **Lint**: `pnpm lint` - Uses ESLint
- **Format**: `pnpm format` - Uses Prettier

## Architecture

Single-file middleware in `src/index.ts`:
- Exports `tinyws()` factory function that returns async middleware
- Exports `TinyWSRequest` interface extending `http.IncomingMessage` with `ws()` method
- Middleware checks for WebSocket upgrade header and attaches `req.ws` function
- `req.ws()` returns a Promise that resolves to a WebSocket instance after `handleUpgrade`
- Accepts optional `ServerOptions` and existing `WebSocketServer` instance

## Code Style

- Pure ESM (`"type": "module"`)
- Biome for formatting (2 spaces, single quotes, no trailing commas, no semicolons)
- Line width 120 characters
