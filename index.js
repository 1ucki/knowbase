const path = require('path')
const express = require('express')
const WebSocket = require('ws')

const app = express()
const port = 4000

app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)

const wss = new WebSocket.Server({
  port: 4001,
  clientTracking: true
})

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message)

    if (msg.do === 'send_viewer') {
      console.log(wss.clients)
      /* wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          const returnMsg = {
            id: msg.id,
            do: 'set_viewer',
            viewer: wss.clients
          }

          client.send(JSON.stringify(returnMsg))
        }
      }) */
    } else {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    }
  })
})

console.log(`knowbase presenting at http://localhost:${ port }`)