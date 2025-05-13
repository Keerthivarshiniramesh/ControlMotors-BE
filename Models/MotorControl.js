const mongoose = require('mongoose')

const controlSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    motorspeed: { type: Number, required: true },
    mode: { type: Number, enum:[0,1], required: true },
    runtime: {

        time: {
            hour: { type: Number, min: 0, max: 23, required: true },
            minutes: { type: Number, min: 0, max: 59, required: true },
            seconds: { type: Number, min: 0, max: 59, required: true }
        }

    }
})

const ControlModel = mongoose.model("MotorControl", controlSchema)

module.exports = ControlModel