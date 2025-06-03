const jwt = require('jsonwebtoken');
const db = require('../database/db');
module.exports =async (req, res, next) => {
    try{
    const token = req.cookies.jwt;
        console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    const [user] = await db('users').where('id',decoded.userID).select('*');

        console.log(user,'fe')

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
    }catch(err){
        console.log(err)
       if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'expired' }); // logout in frontend
        } else {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

}