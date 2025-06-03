const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const db = require('../database/db')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const joinData = require('../utils/joinData')
const addCookie = require('../utils/addCookie')
const _ = require("lodash");



const register = async (req, res) => {
    const {name,email,password} = req.body;
    try{
        const profileImageArray = [
            'https://www.freeiconspng.com/thumbs/pacman-png/pacman-red-png-4.png',
            'https://www.freeiconspng.com/thumbs/pacman-png/pacman-blue-png-10.png',
            'https://www.freeiconspng.com/thumbs/pacman-png/pacman-orange-png-26.png'
        ]

        const hashedPassword = await bcrypt.hash(password, 10);

        await db('users').insert({name,email,password:hashedPassword,profileImage:profileImageArray[_.random(0,2)]});

        const  users = await  db('users').select('id').where({email:email})


        const userID = users[0]?.id

        if (userID) {
            const token = jwt.sign({userID},process.env.JWT_SECRET,{expiresIn:"3d"})

            addCookie(res,'jwt',token)



        }
        const result = await joinData(userID)

        res.status(200).json(result)


    }catch(err){
        res.status(500).json(err);
    }
}

const registerGoogle = async (req, res) => {
    const {token} = req.body;
    try{


        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, picture, sub } = ticket.getPayload();

        const [user] = await db('users').where({email}).select('*')

        console.log(user)
        if ( user) {
            return  res.status(400).json({error:'User with this Google Account exists'});
        }

        await db('users').insert({name,email,profileImage:picture,password:sub});

        const [resultD] = await db('users').where({email:email}).select('*')
        const userID = resultD?.id

        if (userID) {
            const token = jwt.sign({userID},process.env.JWT_SECRET,{expiresIn:"3d"})
            addCookie(res,'jwt',token)
        }
        console.log(userID,'dw')
        const  result = await joinData(userID)
        return res.status(200).json(result)

    }catch(err){
        res.status(500).json(err);
    }
}

const loginGoogle = async (req, res) => {
    const {token} = req.body;
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, sub } = ticket.getPayload();

        console.log(email)
        const [user] = await db('users').where({email}).select('*')
        console.log(user)
        if (!user) {
            return res.status(400).json({ error: "Please register with Google first." });
        }

        if (user.password !== 'GOOGLE_USER' && user.password !== sub) {
            return res.status(403).json({ error: "This email is registered with a password. Use normal login." });
        }

        const tokenJWT = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        addCookie(res,'jwt',tokenJWT)

        const result = await joinData(user.id);
        console.log(result)
        return res.status(200).json(result)
    }catch(err){
        res.status(500).json(err);
    }
}


const login = async (req, res) => {
    const {email,password} = req.body;
    try{

        if (!email || !password){
            return res.status(400).json({ error: "All fields are required" });
        }

        const [user] = await db('users').where('email',email).select('*')

        if(!user){
            return res.status(400).json({error:'User not found'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({error:'Incorrect password'})
        }
        const token = jwt.sign({userID:user.id},process.env.JWT_SECRET,{expiresIn:"3d"})
        addCookie(res,'jwt',token)

        console.log(token)

        const result = await joinData(user.id)

        res.status(200).json(result)


    }catch(err){
        res.status(500).json(err);
    }
}

const logout = async (req, res) => {
    try{
        req.user = null;
        res.clearCookie('jwt')

        res.status(200).json({msg:"logged out successfully"})

    }catch(err){
        res.status(500).json(err);
    }
}


module.exports = {
    register,
    registerGoogle,
    login,
    logout,
    loginGoogle
}