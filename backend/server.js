require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
app.use(cookieParser());
app.use(cors())
app.use(express.json());
app.use('/requests',requestRoutes)
app.use('/auth',authRoutes)


const __name = path.resolve()

app.use(express.static(path.join(__name, "frontend", "dist")));

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__name,"frontend","dist","index.html"));
})



const PORT = process.env.PORT || 8080;



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
