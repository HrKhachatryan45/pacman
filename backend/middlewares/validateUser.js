const validator = require('validator');
const db = require('../database/db');
module.exports =async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }


        const  user = await db('users').where({email}).select('*')
        console.log(user)
        if(user.length > 0){
            return res.status(200).json({error:"Email already exists"})
        }



        if (name.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({ error: 'Email is not valid' });
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({ error: 'Password is not strong' });
        }

        next();
        
    } catch (error) {
        console.log(error);
        
    }
};