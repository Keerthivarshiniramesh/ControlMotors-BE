const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
    id: { type: Number, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true }
})

const loginModel = mongoose.model('UserLogin', loginSchema)

module.exports = loginModel