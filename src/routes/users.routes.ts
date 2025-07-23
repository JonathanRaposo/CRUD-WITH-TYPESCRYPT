import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import MemoryUserStorage from '../usersService'
import {User} from '../usersService/index';

const salt = bcrypt.genSaltSync(10);

type TypedRequest <Params={}, Body={}, Query={}> = Request<Params,any, Body, Query>;

type BCRYPT = string;

interface IdParams {
    id: string;
}

interface createUserPayload {
     name: string;
     email: string;
     password:BCRYPT;
}

const router = express.Router();

router.post('/api/users/create', async function(req:TypedRequest<{},createUserPayload>, res:Response){
 
     console.log(req.body);
     const {name,email, password} = req.body;
     if(!name || !email || ! password){
        return res.status(400).json({message: 'All fields must be provided.'});
     }
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if(!emailRegex.test(email)){
        return res.status(400).json({message: 'Invalid email format.'});
    
     }
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}/;
     if(!passwordRegex.test(password)){
        return res.status(400).json({message: 'Password must have at least one upper case, one lower case and one number.'});
     }

     const user: User | null = await MemoryUserStorage.findOne({email:email});

     if(user){
        return res.status(400).json({message:'Email is already registered.Try with another one.'})
     } 
       
      try{
          const hash = bcrypt.hashSync(password, salt);
          const newUser:Omit<User, 'id'> ={
            name,
            role:'user', 
            email,
           password:hash 
        }
         const result = await MemoryUserStorage.insert(newUser);
         return res.status(201).json(result);
      }
      catch(err){
            return res.status(500).json({ error: 'Internal server error' }); 
      }
   
})
 router.get('/api/users/search', async function(req:Request, res:Response){
      
     const {q} = req.query  as {q: string};
     try{
       const user: User | null = await MemoryUserStorage.search(q);
       if(!user){
        return res.json({message: 'No user found.'});
       }
       return res.json(user);
     }catch(err){
        return res.status(500).json({ error: 'Internal server error' }); 
     }
 })


router.get('/api/users', async function(_req:Request, res:Response){
  
    const users: User[] = await MemoryUserStorage.find();
    res.json(users)
});

router.get('/api/users/:id',async function(req:Request<IdParams>, res:Response){

    const {id} = req.params;
    const user: User | null = await MemoryUserStorage.findById(id);
    if(!user){
        res.status(404).json({error: 'User not found'});
        return;
    }
    res.json(user);
    
})
router.post('/api/users/:id/update', async function(req:TypedRequest<IdParams,createUserPayload>, res:Response){
      
     const {name,email, password} = req.body;
     const {id} = req.params;
     if(!name || !email || ! password){
        return res.status(400).json({message: 'All fields must be provided.'});
     }

      try{
            const user: User | undefined = await MemoryUserStorage.updateById(id, req.body);
            if(!user){
               return res.status(400).json({message: 'Something went wrong. Unable to update user.'});
             }
             return res.json(user);
        }
        catch(err){
          return res.status(404).json({message: 'No user found.'})
      }
})

router.post('/api/users/:id/delete', async function(req:Request<IdParams>, res:Response){
     console.log(req.params)
     const {id} = req.params;

     const result: {deleted:number} | undefined = await MemoryUserStorage.deleteById(id);
     if(!result){
        return res.status(404).json({message: 'No user found.'})
     }
     return res.json(result);
})

export default router;