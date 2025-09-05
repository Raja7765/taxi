const express = require('express');
const dotenv = require('dotenv');
const {Pool} = require('pg');


//Load dotenv file 
dotenv.config();
const app = express();

//middleware
app.use(express.json());

//Postgres Pool

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//test db connection
pool.connect()
.then(() => console.log('Database connected successfully'))
.catch(err => console.error('Database connection error', err.stack));



//Routes
app.get('/', (req, res) => {
    res.send('Taxi Service is running');
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 


module.exports = app;