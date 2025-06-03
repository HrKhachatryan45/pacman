require('dotenv').config();

const addCookie = (res,name, value, ) => {
    res.cookie(name,value,{
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite:'strict'
    })
}
module.exports = addCookie;