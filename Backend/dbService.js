// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 

/* for debugging
console.log(process.env.HOST);
console.log(process.env.USER);
console.log(process.env.PASSWORD);
*/

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});

connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 
class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        return instance? instance: new DbService();
    }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "names" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "names" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */


   async verifyUserCredentials(username, password) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

            connection.query(query, [username, password], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });

        return response.length > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
   }

   async addUser(username, password, firstname, lastname, salary, age, registerday, signintime, userid) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (username, password, firstname, lastname, salary, age, registerday, signintime, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

            connection.query(query, [username, password, firstname, lastname, salary, age, registerday, signintime, userid], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            });
        });

        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
   }


    async getAllData(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT * FROM users;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
        
            // console.log("dbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }

   async insertNewName(name){
         try{
            const dateAdded = new Date();
            // use await to call an asynchronous function
            const insertId = await new Promise((resolve, reject) => 
            {
               const query = "INSERT INTO users (name, date_added) VALUES (?, ?);";
               connection.query(query, [name, dateAdded], (err, result) => {
                   if(err) reject(new Error(err.message));
                   else resolve(result.insertId);
               });
            });
            console.log(insertId);  // for debugging to see the result of select
            return{
                 id: insertId,
                 name: name,
                 dateAdded: dateAdded
            }
         } catch(error){
               console.log(error);
         }
   }

   async searchByName(name){
        try{
             const dateAdded = new Date();
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = "SELECT * FROM users where name = ?;";
                     connection.query(query, [name], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                     });
                  }
             );

             // console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }

   async searchBySalaryRange(min, max) {
      try {
          const response = await new Promise((resolve, reject) => {
              const query = `SELECT * FROM users WHERE salary BETWEEN ? AND ?;`;
              connection.query(query, [min, max], (err, results) => {
                  if (err) {
                      reject(new Error(err.message));
                  } else {
                      resolve(results);
                  }
              });
          });
  
          return response;
      } catch (error) {
          console.log(error);
      }
  }

  async searchByAgeRange(min, max) {
   try {
       const response = await new Promise((resolve, reject) => {
           const query = `SELECT * FROM users WHERE age BETWEEN ? AND ?;`;
           connection.query(query, [min, max], (err, results) => {
               if (err) {
                   reject(new Error(err.message));
               } else {
                   resolve(results);
               }
           });
       });

       return response;
   } catch (error) {
       console.log(error);
   }
}

async searchByFullName(firstName, lastName) {
   try {
       const response = await new Promise((resolve, reject) => {
           let query = "SELECT * FROM users WHERE";
           const queryParams = [];

           if (firstName) {
               query += " firstname LIKE ?";
               queryParams.push(`%${firstName}%`);
           }

           if (lastName) {
               if (firstName) query += " AND";  // Add AND if firstName exists
               query += " lastname LIKE ?";
               queryParams.push(`%${lastName}%`);
           }

           connection.query(query, queryParams, (err, results) => {
               if (err) {
                   reject(new Error(err.message));
               } else {
                   resolve(results);
               }
           });
       });

       return response;
   } catch (error) {
       console.log(error);
   }
}

async searchByUserId(userid) {
   try {
       const response = await new Promise((resolve, reject) => {
           const query = `SELECT * FROM users WHERE userid = ?;`;
           connection.query(query, [userid], (err, results) => {
               if (err) {
                   reject(new Error(err.message));
               } else {
                   resolve(results);
               }
           });
       });

       return response;
   } catch (error) {
       console.log(error);
   }
}

// async searchUsersRegisteredAfter(userid) {
//    try {
//        // Get the registration date for the specified user
//        const userRegisterDate = await new Promise((resolve, reject) => {
//            const query = `SELECT registerday FROM users WHERE userid = ?;`;
//            connection.query(query, [userid], (err, results) => {
//                if (err) {
//                    reject(new Error(err.message));
//                } else if (results.length === 0) {
//                    reject(new Error('User not found'));
//                } else {
//                    resolve(results[0].registerday);
//                }
//            });
//        });

//        // Find all users registered after the retrieved date
//        const response = await new Promise((resolve, reject) => {
//            const query = `SELECT * FROM users WHERE registerday > ?;`;
//            connection.query(query, [userRegisterDate], (err, results) => {
//                if (err) {
//                    reject(new Error(err.message));
//                } else {
//                    resolve(results);
//                }
//            });
//        });

//        return response;
//    } catch (error) {
//        console.log(error);
//    }
// }


async searchUsersRegisteredAfter(userid) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = `SELECT * FROM users WHERE userid > ?;`;
            connection.query(query, [userid], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}




   async deleteRowById(id){
         try{
              id = parseInt(id, 10);
              // use await to call an asynchronous function
              const response = await new Promise((resolve, reject) => 
                  {
                     const query = "DELETE FROM users WHERE id = ?;";
                     connection.query(query, [id], (err, result) => {
                          if(err) reject(new Error(err.message));
                          else resolve(result.affectedRows);
                     });
                  }
               );

               console.log(response);  // for debugging to see the result of select
               return response === 1? true: false;

         }  catch(error){
              console.log(error);
         }
   }

  
  async updateNameById(id, newName){
      try{
           console.log("dbService: ");
           console.log(id);
           console.log(newName);
           id = parseInt(id, 10);
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
               {
                  const query = "UPDATE names SET users = ? WHERE id = ?;";
                  connection.query(query, [newName, id], (err, result) => {
                       if(err) reject(new Error(err.message));
                       else resolve(result.affectedRows);
                  });
               }
            );

            // console.log(response);  // for debugging to see the result of select
            return response === 1? true: false;
      }  catch(error){
         console.log(error);
      }
  }
}

module.exports = DbService;
