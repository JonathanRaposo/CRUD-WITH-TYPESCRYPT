import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import usersRouter from './routes/users.routes';
import bodyParser from './middlewares/bodyParser';
const app = express();

app.use(bodyParser())
app.use('/',usersRouter )

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log('Server running at http://localhost:',PORT));
