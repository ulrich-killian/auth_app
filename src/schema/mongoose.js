import mongoose from "mongoose";

const userSchema = mongoose.Schema({
   username: {Types: String, require: true},
   password: {Types: String, require: true}
})

const User = mongoose.model('User', userSchema)

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/auth_app')
   console.log("database connected to cluster succefully");
   
  const newUser = new User({username: 'claude', password: 'claude111'})
  await newUser.connect()
  console.log('database saved one user');
  
  await mongoose.connection.close()
  console.log("database connection lost");
  
}