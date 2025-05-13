const UserModel = require('../Models/SignUp')

const Auth = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.send({ success: false, message: "Please Login and try again" })
        }

        const user = UserModel.find({ email: req.session.user.email.toLowerCase() })

        if (!user) {
            return res.send({ success: false, message: "User not found" })
        }
        next()
    }
    catch (err) {
        console.log("Error in isAuth:", err)
        return res.send({ success: false, message: 'Trouble in checking Authentication! Please contact support Team.' })
    }
}
module.exports = Auth