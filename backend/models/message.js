const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  content: String,
  user: String,
  date: Date,
  roomid: String,
})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message
