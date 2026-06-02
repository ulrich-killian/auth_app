import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'askjdh7s68687a786das'

async function register() {
  const user = { username: 'user', password: "password" }
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(user.password, salt)
  console.log('user registered successfully! ')
  return { username: user.username, hash }
}

async function login() {
  const { hash, username } = await register()
  const typePassword = "password"
  const isMatch = await bcrypt.compare(typePassword, hash)
  if (isMatch) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' })
    console.log(`welcome back ${username}! `)
    console.log(`Token: ${token}`)
    return token
  } else {
    console.log("wrong password! ")
  }
}

function verify(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    console.log(`Decoded token:`, decoded)
  } catch (error) {
    console.error("Invalid token! ", error)
  }
}

async function main() {
  const token = await login()
  verify(token) //  pass real token
  verify("fakeToken123") //  test fake token
}

main()