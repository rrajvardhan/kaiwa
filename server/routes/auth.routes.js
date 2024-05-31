import express from 'express'
// JSON Web Tokens (JWTs) are a compact and self-contained way for securely transmitting information between parties as a JSON object.
import jwt from 'jsonwebtoken'
// The bcryptjs library is a JavaScript library used for hashing passwords.
import bcrypt from 'bcryptjs'
//mongodb user model
import User from '../models/user.model.js'

//generate token
function generateTokenAndSetCookie(userid, res) {
    // In the context of web security, a token is a string of data that is used to authenticate a user. It is a secure way to represent information between the client and server. Tokens are often used in place of traditional session identifiers (like cookies) to keep track of authenticated users.Tokens can come in various forms, but JWT is a popular format for tokens due to its compact size and ease of use.
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })

    // A cookie is a small piece of data that a server sends to the user's web browser. The browser may store the cookie and send it back to the same server with subsequent requests. Cookies are used to remember information about the user between HTTP requests
    /*
    Uses:
    Session Management: Storing user authentication tokens or session identifiers.
    Personalization: Remembering user preferences, themes, and settings.
    Tracking: Tracking user behavior for analytics and advertising purposes.
    */
    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds
        httpOnly: true, //prevent XSS (cross site scripting) Attacks
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development', //cookie only works in https
    })
    // When a user logs into a web application, the server generates a JWT that contains the user's information and signs it with a secret key. This token is then sent to the user's browser and stored in a cookie. For subsequent requests, the browser automatically sends the cookie back to the server.
    // The server can then verify the token, extract the user information, and authenticate the user without needing to look up the session information in a database. This approach is stateless, meaning the server does not need to store session data, improving scalability and performance.
}

//signup controller
const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'passowrds do not match...' })
        }

        const user = await User.findOne({ username })

        if (user) {
            return res.status(400).json({ error: 'username already exists...' })
        }

        //encrypt pasword
        // The genSalt method generates a salt, which is then used in hashing functions to ensure that the same password does not always result in the same hash, thus adding an additional layer of security.
        // bcrypt.genSalt(10) generates a salt with a cost factor (or rounds) of 10.
        // bcrypt.hash(pass, salt) hashes the plain text password using the generated salt.
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)

            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
            })
        } else {
            return res.status(400).json({ error: 'invalid user data...' })
        }
    } catch (error) {
        console.log('error at Auth controller ( signup )\n', error.message)
        res.status(500).json({ error: 'internal server error' })
    }
}

//login controller
const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        const isPasswordValid = await bcrypt.compare(password, user?.password || ' ')

        if (!user || !isPasswordValid) {
            return res
                .status(400)
                .json({ error: 'invalid username or password...' })
        }

        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
        })
    } catch (error) {
        console.log('error in Auth controller (login)', error.message)
        res.status(500).json({ error: 'internal server error' })
    }
}

//logout controller
const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({ message: 'logged out succesfully' })
    } catch (error) {
        console.log('error in Auth controller( logout )\n', error)
        res.status(500).json({ error: 'internal server error.' })
    }
}

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

export default router
