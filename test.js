import bcrypt from "bcrypt";

register();

async function register() {
  const users = [
    { username: "john", password: "john123" },
    { username: "ayo", password: "ayo123" },
    { username: "test", password: "test123" },
  ];

  for (const user of users) {
   const salt = await bcrypt.genSalt(12);
   const hashPassword = await bcrypt.hash(user.password, salt);
   console.log(`${user.username} hash:`, hashPassword);
  } 
}

async function  login() {
   try {
      const storedUser = {
         username: "john", 
         password: "$2b$10$M4UukgMp33tzvtCxy9HCBe4Gs/4i8GzM00z1p1okv/lqfq9zkb6hK" 
        }
           const typePassword = 'john123';
           const isMatch = await bcrypt.compare(typePassword, storedUser.password)
           if (isMatch) {
            console.log("Welcome in john!")
           } else {
            console.log("Wrong password")
           }
   } catch (error) {
      console.log(error)
   }
}
login()