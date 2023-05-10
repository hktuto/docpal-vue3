import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineEventHandler( async(event:any) => {
    let id = event.context.params.id as string
    id = id.replace(/\-/g, '/')
    
    const body = await readBody(event)
    const relativeToCurrent = '../../../../'; // get /packages path in dev, later may need to handle path from server
    const p = path.join(__dirname, relativeToCurrent, `/dp-api/src/json/${id}` ); 
    try {
      fs.readFile(p, (err, contents) => {
        if (err) return false;
        fs.writeFile(p, JSON.stringify(body), 'utf8', (err) => {
          if(err) return false;
          console.log("success");
          return true
        });
      })

    } catch (error) {
      return false;  
    }
    return true
    
  })
  