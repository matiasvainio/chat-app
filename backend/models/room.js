const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
  name: { type: String, unique: true, null: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  private: { type: Boolean, null: false },
})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room
