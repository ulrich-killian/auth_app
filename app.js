const { readFile } = require('fs')

const getText = (path) => {
  return new Promise((resolve, reject) => {
    readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

getText("./folder/first.txt")
  .then((result) => console.log(result))
  .catch((err) => console.log(err));

  const start = async () => {
   try {
      const first = await getText('./folder/first.txt')
      if(first){
          console.log(first);  
      }
   } catch (error) {
      console.log(error)
   }
  }
  start()