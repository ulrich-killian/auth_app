import express from 'express'; // imported express from express 
import jwt from 'jsonwebtoken'; // imported jwt from jsonwebtoken
import bcrypt from 'bcrypt'; //imported bcrypt from bcyrpt
import bodyParser from 'body-parser'; //bodyparser from body-parser

const app = express(); // initialize  express 
app.use(bodyParser.json()); //using the initialize parsing the response into a body parser.json

const JWT_SECRET = "2000021020010011"; //get our jwt secret key 
const userInfo = [ ]; // storing userinfo since this is a test in real word we will use db

app.post('/register', async (req, res) => { //http request take a path req and res then callback function below is a destructure of username and password into our body 
   const { username, password } = req.body;


const salt = await bcrypt.genSalt(10);

const hashedPassword = bcrypt.hash(password,  salt);

const newUser = {
   username: username,
   passwordhash: hashedpassword
}
userDatabase.push(newUser);
res.status(201).json({ message: "User register seccufully" })
})

app.post()
