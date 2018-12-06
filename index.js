const path = require('path')
const express = require('express')
const WebSocket = require('ws')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use('/controller', express.static(path.join(__dirname, 'controller')))

app.listen(80)

const wss = new WebSocket.Server({ port: 3001 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })
})