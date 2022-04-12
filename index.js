express = require('express')
const app = express()

app.use('/', (req, res, next) => {
  res.send('hello world')
})

app.listen(3001, () => {
  console.log('server running')
})
