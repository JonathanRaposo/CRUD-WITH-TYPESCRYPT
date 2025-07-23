import { NextFunction, Request, Response } from "express";

/**
 * Helper
 * 
 * Note:Record<Keys, Type> is a TypeScript utility type used to define an object type with a fixed set of keys and a consistent value type.This means, an object with any string key, and string values.
 * 
 * 
 */

function parseQueryString(str:string): Record<string, any> {
   
     const obj:Record<string, any> = {};
     const pairs = str.split('&');

     for(let pair of pairs){
        const [key, value] = pair.split('=');
        obj[key] = decodeURIComponent(value);
     }
     return obj;
}

function bodyParser(){

     return function(req: Request, _res: Response, next:NextFunction){
        const contentType = req.headers["content-type"];

        let body: string = '';

        req.on('data', function(chunks){
          body+=chunks.toString();
        })
        req.on('end', function(){
            if(body){
               if(contentType === 'application/x-www-form-urlencoded'){
                req.body = parseQueryString(body);

               } else if(contentType === 'application/json'){
                req.body = JSON.parse(body);
               }
            }else{
                req.body = {};    
            }
              next();
        })
     }
}


export default bodyParser;