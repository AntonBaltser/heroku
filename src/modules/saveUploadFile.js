const path = require('path');
const fs = require('fs');


module.exports = (req, res)=>{

    let fileName = path.basename(req.url);
    let file = path.join(__dirname, '../../uploads', fileName);
    let imageFolder = path.join(__dirname, '../user_avatar', fileName)
  
    req.pipe(fs.createWriteStream(file));
    req.on('end', ()=>{
      fs.copyFile(file, imageFolder, err=>{
        if(err){
          console.log(err);
        }
        fs.unlink(file, err =>{
          if(err){
            console.log(err);
          }
        })
      });

console.dir(fileName);

        res.writeHead(200, {'Content-Type': 'text'});
      // console.log(res.writeHead(200, {'Content-Type': 'text'}))
      res.write(fileName);
      res.end();
    });
  };