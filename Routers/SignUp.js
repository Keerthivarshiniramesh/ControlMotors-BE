const Express = require('express')
const SignUpModel = require('../Models/SignUp')

const SignupRouter = Express.Router()

SignupRouter.post('/register', async (req, res) => {
    try {
        const { fullname, email, contact, password } = req.body

        if (!fullname || !email || !contact || !password) {
            return res.send({ success: false, message: 'Please provide all details!' })
        }

        const fetchUser = await SignUpModel.findOne({ email: email.toLowerCase() })
        if (fetchUser) {
            return res.send({ success: false, message: 'Account already exist! Please try login.' })
        }


        const lastUser = await SignUpModel.findOne().sort({ id: -1 })
        const last_id = lastUser ? lastUser.id + 1 : 1

        const newUser = new SignUpModel({
            id: last_id,
            fullname: fullname,
            email: email,
            contact: contact,
            password: password
        })

        const saveUser = await newUser.save()

        if (saveUser) {

            req.session.user = {
                id: saveUser.id,
                fullname: saveUser.fullname,
                email: saveUser.email,
                contact: saveUser.contact,
                role: saveUser.role,
            }

            req.session.save((err) => {
                if (err) {
                    return res.send({ success: false, message: "Failed to create session!" })
                }

                return res.send({ success: true, message: "User Registration successfully!", user: req.session.user })
            })

        }
        else {
            return res.send({ success: false, message: 'Failed to create User!' })
        }

    }
    catch (err) {
        console.log("Error in Register:", err)
        return res.send({ success: false, message: 'Trouble in Registration! Please contact admin.' })
    }
})

SignupRouter.post('/update-user/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        const { fullname, email, contact, password } = req.body
        console.log(fullname, email, password, contact)

        if (!fullname || !email || !password || !contact) {
            return res.send({ success: false, message: "All fileds are required" })
        }

        if (!id) {
            return res.send({ success: false, message: " User id not found" })
        }
        const update_user = await SignUpModel.updateOne({ id }, {
            $set: {
                fullname,
                email,
                password,
                contact
            }
        })

        if (update_user.modifiedCount > 0) {
            return res.send({ success: true, message: "Update User details successfully", updates: update_user })
        }
        else {
            return res.send({ success: false, message: "Not Update" })
        }
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.send({ success: false, message: " Server error please try again later" })
    }
})

// delete the   particular users
SignupRouter.delete('/delete-user/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (id) {
            const delete_id = await SignUpModel.deleteOne({ id })
            if (delete_id.deletedCount > 0) {
                return res.send({ success: true, message: ` Deleted  successfully ` })
            }
            else {
                return res.send({ success: false, message: "Not Deleted" })
            }
        }
        else {
            return res.send({ success: false, message: " Id not found" })
        }
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.send({ success: false, message: " Server error please try again later" })
    }
})

// get all the users details
SignupRouter.get('/allusers', async (req, res) => {
    try {
        const all_users = await SignUpModel.find({})

        if (all_users) {
            return res.send({ success: true, message: "All users details fetched", users: all_users })
        }
        else {
            return res.send({ success: false, message: "No Users found" })
        }
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.send({ success: false, message: " Server error please try again later" })
    }
})


SignupRouter.get('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (id) {
            const particular_id = await SignUpModel.findOne({ id })

            if (particular_id) {
                return res.send({ success: true, users: particular_id })
            }
            else {
                return res.send({ success: false, message: "No User found" })
            }
        }
        else {
            return res.send({ success: false, message: " User  id not found" })
        }
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.send({ success: false, message: " Server error please try again later" })
    }
})


module.exports = SignupRouter


