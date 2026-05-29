import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const secretKey = "9c7cdfafbf110073091285cb000cd87f16480c9389a6baad8e1aabba702b20ae49a93a88a7e07490f0cfbfe939827f91f657f39fda5eccaef0a6217ef880d20f"

async function register() {
  const hashedUsers = [];
  const users = [
    { username: "john", password: "john123" },
    { username: "ayo", password: "ayo123" },
    { username: "test", password: "test123" },
  ];
  for (const user of users) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    hashedUsers.push({ username: user.username, password: hashPassword });
  }
  return hashedUsers;
};

register();

async function login() {
  const hashedUsers = await register();
  const typedPasswords = ["john123", "ayo999", "test123"];
  for (let i = 0; i < hashedUsers.length; i++) {
    const isMatch = await bcrypt.compare(typedPasswords[i], hashedUsers[i].password);
    if (isMatch) {
      const token =  jwt.sign({hashedUsers}, secretKey, {expiresIn: "1h"});
      const decoded = jwt.verify(token, secretKey)
      console.log(`user token: ${token}`);
      console.log(decoded)
      console.log(`Welcome back ${hashedUsers[i].username}! `);
    } else {
      console.log(`Wrong password for ${hashedUsers[i].username} `);
    }
  }
}

login();
