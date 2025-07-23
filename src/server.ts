import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import usersRouter from './routes/users.routes';
import bodyParser from './middlewares/bodyParser';
const app = express();

app.use(bodyParser())


/*
REST endpoints provide:

POST /api/users/create — create user

GET /api/users — list all users

GET /api/users/:id — get user by ID

GET /api/users/search?q=keyword — search users

POST /api/users/:id/update — update user

POST /api/users/:id/delete — delete user 
 */ 

app.use('/',usersRouter )

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log('Server running at http://localhost:',PORT));
