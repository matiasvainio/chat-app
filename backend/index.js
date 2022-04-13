express = require('express')
const app = express()

app.use('/chat', (req, res, next) => {
  res.send('<h1>Chat</h1>')
})

app.use('/', (req, res, next) => {
  res.send('hello world')
})

app.listen(3001, () => {
  console.log('server running')
})
