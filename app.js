import express from 'express'
import { PORT }  from './src/config/env.js'
const app = express()

app.get('/', (req, res) => {
  res.send("Hello world")
})

app.listen(PORT, () => {
  console.log(`server is running live on http://localhost:${PORT}`);
})

export default app;