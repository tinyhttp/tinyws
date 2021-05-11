# Chat example

Simple chat server built with [tinyhttp](https://github.com/talentlessguy/tinyhttp) and tinyws.

## Run

```sh
esno server.ts
```

now open a few terminal windows and send messages.

```sh
$ wscat -c http://localhost:3000/chat
# > hello
# < hello
# < someone else sent this
# >
```
