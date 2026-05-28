import bcrypt from "bcrypt";

register();

async function register() {
  const users = [
    { username: "john", password: "john123" },
    { username: "ayo", password: "ayo123" },
    { username: "test", password: "test123" },
  ];

  for (const user of users) {
   user.password, 
   user.username  

   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(user.password, salt);
   console.log(`${user.username} hash:`, hashPassword);
  } 
}

