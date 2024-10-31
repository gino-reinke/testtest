const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const app = express();
const dbService = require('./dbService');

const FRONTEND_DIR = path.join(__dirname, '../Frontend');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.post('/signup', (req, res) => {
    // Handle sign-up logic
    const { username, password, firstname, lastname, salary, age, registerday, signintime, userid } = req.body;
    const db = dbService.getDbServiceInstance();
    
    db.addUser(username, password, firstname, lastname, salary, age, registerday, signintime, userid)
        .then(() => {
            console.log('User signed up successfully');
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});



app.post('/signin', (req, res) => {
    // Handle sign-in logic
    const { username, password } = req.body;
    const db = dbService.getDbServiceInstance();
    
    db.verifyUserCredentials(username, password)
        .then(isValidUser => {
            if (isValidUser) {
                console.log('sign in success');
                // res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
                res.json({ success: true });          
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});



// create
app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    const { name } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewName(name);
    
    result
        .then(data => response.json({ data: data })) // return the newly added row to frontend, which will show it
        .catch(err => console.log(err));
});

// read
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    console.log(name);
    const db = dbService.getDbServiceInstance();
    let result;
    
    if (name === "all") // in case we want to search all
        result = db.getAllData();
    else
        result = db.searchByName(name); // call a DB function
        
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/searchSalary', (request, response) => {
    const { min, max } = request.query;
    const db = dbService.getDbServiceInstance();  // Get an instance of the DbService

    db.searchBySalaryRange(min, max)
        .then(data => response.json({ data: data }))
        .catch(err => console.error(err));
});

app.get('/searchAge', (request, response) => {
    const { min, max } = request.query;
    const db = dbService.getDbServiceInstance();  // Get an instance of the DbService

    db.searchByAgeRange(min, max)
        .then(data => response.json({ data: data }))
        .catch(err => console.error(err));
});

app.get('/searchName', (request, response) => {
    const { firstName, lastName } = request.query;
    const db = dbService.getDbServiceInstance();  // Get an instance of the DbService

    db.searchByFullName(firstName, lastName)
        .then(data => response.json({ data: data }))
        .catch(err => console.error(err));
});

app.get('/searchUserId', (request, response) => {
    const { userid } = request.query;
    const db = dbService.getDbServiceInstance();  // Get an instance of the DbService

    db.searchByUserId(userid)
        .then(data => response.json({ data: data }))
        .catch(err => console.error(err));
});

// app.get('/searchAfterUser', (request, response) => {
//     const { userid } = request.query;
//     const db = dbService.getDbServiceInstance();  // Get an instance of the DbService

//     db.searchUsersRegisteredAfter(userid)
//         .then(data => response.json({ data: data }))
//         .catch(err => console.error(err));
// });

app.get('/searchAfterUser', (req, res) => {
    const { userid } = req.query;
    const db = dbService.getDbServiceInstance();
    
    db.searchUsersRegisteredAfter(userid)
        .then(data => res.json({ data: data }))
        .catch(err => console.error(err));
});




// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
          const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5000/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// set up the web server listener
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on " + process.env.PORT);
    }
);
