import * as path from 'path';
import {promises} from 'fs';
import users from '../data/users.json'
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcryptjs';


const USER_DB_PATH = path.join(__dirname, '..','..','src','data', 'users.json');


type UUID = string;
type BCRYPT = string;

 export interface User {
    readonly id: UUID;
    name: string;
    role: string;
    email:string;
    password:BCRYPT;
}


class  MemoryUserStorage{
    private data: Array<User>;
    private idStore: Map<string, User>;
    private emailStore: Map<string, User>;
    private nameStore: Map<string, User>;
    private indexStore: Map<number, User>;
 
    constructor(users: User[]){
      this.data = [];
      this.idStore = new Map();
      this.emailStore = new Map();
      this.nameStore = new Map();
      this.indexStore = new Map();
      this.loadData(users)
    }

    loadData(users:User[]): void {
        this.data = users;
        for(let i= 0 ; i< users.length; i++){
            const user = users[i];
            this.idStore.set(user.id, user);
            this.emailStore.set(user.email.toLowerCase(), user);
            this.nameStore.set(user.name.toLowerCase(), user);
            this.indexStore.set(i, user);
        }

    }
    async insert(user:Omit<User, 'id'>): Promise<User> {
      const newUser: User = Object.assign({id:uuid4()}, user) ;
       this.data.push(newUser);
       this.idStore.set(newUser.id, newUser);
       this.emailStore.set(newUser.email, newUser);
       this.nameStore.set(newUser.name, newUser);
       this.indexStore.set(this.data.length -1 , newUser);
      await saveToDisk(USER_DB_PATH,this.data);
      return newUser;
    }

    async search(keyword:string): Promise<User | null>{
        const users = this.data;
        const regex = new RegExp(keyword, 'i');

        for(const user of users){
          if(regex.test(user.name) || regex.test(user.email) || regex.test(user.role)){
            return user
            }
        }
        return null;
    }

    async find(): Promise<User[]>{
        return this.data;
    }
    async findById(id:string): Promise<User | null>{
        const user = this.idStore.get(id);
        if(!user)return null;
        return user;
    }
    async findOne(options: {name?:string; email?:string}): Promise<User | null>{
         
          if(options.name){
            const user =  this.nameStore.get(options.name.toLowerCase());
             if(!user)return null
             return user;

          }
          if(options.email){
            const user = this.emailStore.get(options.email.toLowerCase());
            if(!user)return null;
            return user;
          }
          return null;
    }
      async findByValue(callback:(user:User)=> boolean): Promise<User | null>{
        const users: User[] = this.data;
        for(const user of users){
           if(callback(user)){
            return user;
           }
        }
        return null;
    }
    async updateById(id:string, updatedData:Partial<User>): Promise<User | undefined>{

        const user = this.idStore.get(id);
        if(user){

            const updatedUser: User = {
            id: user.id,
            name: updatedData.name || user.name,
            role: user.role,
            email: updatedData.email || user.email,
            password: updatedData.password || user.password
       
        }

        this.nameStore.delete(user.name);
        this.emailStore.delete(user.email);
        this.idStore.set(updatedUser.id, updatedUser);
        this.nameStore.set(updatedUser.name, updatedUser);
        this.emailStore.set(updatedUser.email, updatedUser);
        const idx: number= this.data.findIndex(function(user){return user.id === id});
        
        if(idx !== -1){
          this.data[idx] = updatedUser;
          await saveToDisk(USER_DB_PATH, this.data);
          return updatedUser;
        } 
        }
        return undefined

    }

    async deleteById(id:string): Promise<{deleted:number} | undefined>{
        const users: User[] = this.data;

        for(let i = 0 ; i < users.length; i++){
           const user = users[i];
           if(user.id === id){
            this.data.splice(i, 1);
            this.idStore.delete(id);
            this.nameStore.delete(user.name)
            this.emailStore.delete(user.email);
            this.indexStore.delete(i)
            await saveToDisk(USER_DB_PATH, this.data);
            this.loadData(this.data);
            return {deleted: 1}
           }
        }
        return undefined
    }
  
    printNameEntries():void{
        console.log(this.nameStore);
    }
    printEmailEntries():void{
        console.log(this.emailStore);
    }
    printIdEntries():void{
        console.log(this.idStore)
    }
    printIndexEntries():void{
        console.log(this.indexStore);
    }

}
async function saveToDisk(filePath:string,users: User[]): Promise<void> {
    try{
        await promises.writeFile(filePath, JSON.stringify(users,null,2),'utf8');
    }catch(err){
        console.log('Error saving file:',err);
        
    }
}

export default new MemoryUserStorage(users);
