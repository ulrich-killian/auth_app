import bcrypt from 'bcrypt';

async function register() {
   const userInfo =  {
      username: "username",
      password: "password1"
   };
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userInfo.password, salt)
    console.log(hashPassword);
}
console.log(register());
