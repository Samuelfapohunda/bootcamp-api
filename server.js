const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require ('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');



//route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//load env vars
dotenv.config({path: './config/config.env'});

//connect to database
connectDB();

const app = express();
// Body Parser
app.use(express.json());


// Cookie parser 
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV ==='development') {
    app.use(morgan('dev'));
};

//File uploading 
app.use(fileUpload());

//Sanitize data
app.use(mongoSanitize())

//Set security headers 
app.use(helmet())

//prevent xss attacks
app.use(xss())

//set static folder 
app.use (express.static(path.join(__dirname, 'public')))

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;



const server = app.listen(PORT, () => {
console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});


//Handle unhandled rejections 
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server and exit process
    // server.close(() => process.exit(1))
});