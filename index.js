const path = require('path')
const express = require('express')
const WebSocket = require('ws')

const app = express()
const port = 4000

app.use(express.static(path.join(__dirname, 'public')))
app.use('/controller', express.static(path.join(__dirname, 'controller')))

app.listen(port)

const wss = new WebSocket.Server({ port: 4001 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })
})

console.log(`knowbase presenting at http://localhost:${ port }`)