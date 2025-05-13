const Express = require('express')
const ControlModel = require('../Models/MotorControl')
const isAuth = require('../Auth/isAuth')
const axios = require('axios');

const ControlRouter = Express.Router()


ControlRouter.post('/create-motorcontrol', isAuth, async (req, res) => {
    try {
        const { rpm, duration, mode } = req.body;

        // Check required fields
        if (rpm == null || duration == null || mode == null) {
            return res.status(400).send({
                message: "All fields (rpm, duration, mode) are required",
                success: false
            });
        }

        // Get last id and prepare runtime
        const last_data = await ControlModel.findOne().sort({ id: -1 });
        const last_id = last_data ? last_data.id + 1 : 1;

        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;

        const new_data = new ControlModel({
            id: last_id,
            motorspeed: rpm,
            mode,
            runtime: {
                time: {
                    hour: hours,
                    minutes: minutes,
                    seconds: seconds
                }
            }
        });

        await new_data.save();

        // Send to ThingSpeak
        const url = `https://api.thingspeak.com/update?api_key=3J8GAGL5DDPVYW64&field1=${rpm}&field2=${hours}:${minutes}:${seconds}&field3=${mode}`;
        const response = await axios.get(url);
        if (response.data === 0) {
            return res.status(500).send({
                message: "Failed to update ThingSpeak",
                success: false
            });
        }


        res.send({
            message: "Motor control data saved and sent to ThingSpeak successfully",
            success: true,
            data: new_data
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({
            message: "Internal Server Error",
            success: false
        });
    }
})


module.exports = ControlRouter