const Express = require('express')
//import models and middleware
const SignUp_models = require('../Models/SignUp')
const Login_models = require('../Models/SignIn')
const isAuth = require('../Auth/isAuth')


const LoginRouters = Express.Router()

LoginRouters.post('/login', async (req, res) => {
    try {
        const { email, pwd } = req.body
        console.log(email, pwd)

        if (!email || !pwd) {
            return res.send({ success: false, message: "All fileds are required" })
        }

        const check_users = await SignUp_models.findOne({ email })

        if (check_users.email !== email || check_users.password !== pwd) {
            return res.send({ success: false, message: "Invalid  email or password or role" })
        }
        const lastUser = await Login_models.findOne().sort({ id: -1 })
        const id = lastUser ? lastUser.id + 1 : 1

        const login = new Login_models({
            id,
            email,
            password: pwd,

        })
        const save_login = await login.save()
        console.log(save_login)
        if (save_login) {
            req.session.user = save_login
            return res.send({ success: true, message: "SignIn  Successfully", users: req.session.users })
        }
        else {
            return res.send({ success: false, message: " Something wrong . Please contact Developer " })
        }
    }
    catch (err) {
        console.log("Error ", err)
        return res.send({ success: false, message: "Error" })
    }
})


// logout routers
LoginRouters.delete('/logout', isAuth, async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.send({ succes: false, message: "Some thing error in logout." })
            }
            return res.send({ succes: true, message: "Logout Successfully" })
        })
    }
    catch (err) {
        console.log("Error in logout", err)
        return res.send({ success: false, message: "Error" })
    }
})

module.exports = LoginRouters