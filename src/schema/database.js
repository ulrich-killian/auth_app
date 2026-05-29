import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   username: { type: String, required: true },
   password: { type: String, required: true }
 })

 const User = mongoose.model('User', userSchema)

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/auth_app")
console.log("connected to mongDB");

const newUser = new User ({ username: "john", password: "john123" });
await newUser.save()
console.log("user saved");

await mongoose.connection.close()
console.log("connection close");

}
main();
