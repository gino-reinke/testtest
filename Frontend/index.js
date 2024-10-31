
// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

/*
What is a Promise in Javascript? 

A Promise can be in one of three states:

    - Pending: The initial state; the promise is neither fulfilled nor rejected.

    - Fulfilled: The operation completed successfully, and the promise has a 
      resulting value.

    - Rejected: The operation failed, and the promise has a reason for the failure.

Promises have two main methods: then and catch.

    - The then method is used to handle the successful fulfillment of a promise. 
    It takes a callback function that will be called when the promise is resolved, 
    and it receives the resulting value.

    - The catch method is used to handle the rejection of a promise. It takes a 
    callback function that will be called when the promise is rejected, and it 
    receives the reason for the rejection.

What is a promise chain? 
    The Promise chain starts with some asyncOperation1(), which returns a promise, 
    and each subsequent ``then`` is used to handle the result of the previous Promise.

    The catch is used at the end to catch any errors that might occur at any point 
    in the chain.

    Each then returns a new Promise, allowing you to chain additional ``then`` calls to 
    handle subsequent results.

What is an arrow function?

    An arrow function in JavaScript is a concise way to write anonymous function 
    expressions.

    Traditional function syntax: 
        const add = function(x, y) {
           return x + y;
        };

    Arrow function syntax:
        const add = (x, y) => x + y;
    
    
Arrow functions have a few notable features:

    - Shorter Syntax: Arrow functions eliminate the need for the function keyword, 
      curly braces {}, and the return keyword in certain cases, making the syntax 
      more concise.

    - Implicit Return: If the arrow function consists of a single expression, it is 
      implicitly returned without needing the return keyword.

    - Lexical this: Arrow functions do not have their own this context; instead, they 
      inherit this from the surrounding code. This can be beneficial in certain situations,
      especially when dealing with callbacks and event handlers.
*/


// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5000/getAll to check what it returns first.
    fetch('http://localhost:5000/getAll')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});


// when the addBtn is clicked
const addBtn = document.querySelector('#add-name-btn');
addBtn.onclick = function (){
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

// when the searchBtn is clicked
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// when the salary search button is clicked
const salarySearchBtn = document.querySelector('#salary-search-btn');
salarySearchBtn.onclick = function () {
    const minSalary = document.querySelector('#min-salary-input').value;
    const maxSalary = document.querySelector('#max-salary-input').value;

    if (!minSalary || !maxSalary) {
        alert('Please enter both min and max salary values.');
        return;
    }

    fetch(`http://localhost:5000/searchSalary?min=${minSalary}&max=${maxSalary}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(err => console.error('Error fetching salary data:', err));
}

// when the age search button is clicked
const ageSearchBtn = document.querySelector('#age-search-btn');
ageSearchBtn.onclick = function () {
    const minAge = document.querySelector('#min-age-input').value;
    const maxAge = document.querySelector('#max-age-input').value;

    if (!minAge || !maxAge) {
        alert('Please enter both min and max age values.');
        return;
    }

    fetch(`http://localhost:5000/searchAge?min=${minAge}&max=${maxAge}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(err => console.error('Error fetching age data:', err));
}

// when the name search button is clicked
const nameSearchBtn = document.querySelector('#name-search-btn');
nameSearchBtn.onclick = function () {
    const firstName = document.querySelector('#first-name-input').value.trim();
    const lastName = document.querySelector('#last-name-input').value.trim();

    // If both are empty, alert the user
    if (!firstName && !lastName) {
        alert('Please enter at least a first name or last name to search.');
        return;
    }

    fetch(`http://localhost:5000/searchName?firstName=${firstName}&lastName=${lastName}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(err => console.error('Error fetching name data:', err));
}

// when the userid search button is clicked
const useridSearchBtn = document.querySelector('#userid-search-btn');
useridSearchBtn.onclick = function () {
    const userid = document.querySelector('#userid-input').value.trim();

    // If user ID is empty, alert the user
    if (!userid) {
        alert('Please enter a User ID to search.');
        return;
    }

    fetch(`http://localhost:5000/searchUserId?userid=${userid}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(err => console.error('Error fetching user data:', err));
}

// when the button to search users who registered after a specific user is clicked
const registeredAfterSearchBtn = document.querySelector('#registered-after-search-btn');
registeredAfterSearchBtn.onclick = function () {
    const userid = document.querySelector('#registered-after-userid-input').value.trim();

    // If User ID is empty, alert the user
    if (!userid) {
        alert('Please enter a User ID to search for users registered after.');
        return;
    }

    fetch(`http://localhost:5000/searchAfterUser?userid=${userid}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(err => console.error('Error fetching users registered after:', err));
}

let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
      function(event){
        if(event.target.className === "delete-row-btn"){

            deleteRowById(event.target.dataset.id);   
            rowToDelete = event.target.parentNode.parentNode.rowIndex;    
            debug("delete which one:");
            debug(rowToDelete);
        }   
        if(event.target.className === "edit-row-btn"){
            showEditRowInterface(event.target.dataset.id); // display the edit row interface
        }
      }
);

function deleteRowById(id){
    // debug(id);
    fetch('http://localhost:5000/delete/' + id,
       { 
        method: 'DELETE'
       }
    )
    .then(response => response.json())
    .then(
         data => {
             if(data.success){
                document.getElementById("table").deleteRow(rowToDelete);
                // location.reload();
             }
         }
    );
}

let idToUpdate = 0;

function showEditRowInterface(id){
    debug("id clicked: ");
    debug(id);
    document.querySelector('#update-name-input').value = ""; // clear this field
    const updateSetction = document.querySelector("#update-row");  
    updateSetction.hidden = false;
    // we assign the id to the update button as its id attribute value
    idToUpdate = id;
    debug("id set!");
    debug(idToUpdate+"");
}


// when the update button on the update interface is clicked
const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function(){
    debug("update clicked");
    debug("got the id: ");
    debug(updateBtn.value);
    
    const updatedNameInput = document.querySelector('#update-name-input');

    fetch('http://localhost:5000/update',
          {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(
                  {
                    id: idToUpdate,
                    name: updatedNameInput.value
                  }
            )
          }
    ) 
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
        else 
           debug("no update occurs");
    })
}


// this function is used for debugging only, and should be deleted afterwards
function debug(data)
{
    fetch('http://localhost:5000/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}

function insertRowIntoTable(data){

   debug("index.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

  // debug(isTableData);

   let tableHtml = "<tr>";
   
   for(var key in data){ // iterating over the each property key of an object data
      if(data.hasOwnProperty(key)){   // key is a direct property for data
            if(key === 'registerday'){  // the property is 'dataAdded'
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

   tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
   tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

   tableHtml += "</tr>";

    if(isTableData){
       debug("case 1");
       table.innerHTML = tableHtml;
    }
    else {
        debug("case 2");
        // debug(tableHtml);

        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data){
    debug("index.js: loadHTMLTable called.");

    const table = document.querySelector('table tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
  
    /*
    In the following JavaScript code, the forEach method is used to iterate over the 
    elements of the data array. The forEach method is a higher-order function 
    that takes a callback function as its argument. The callback function is 
    executed once for each element in the array.
    
    In this case, the callback function takes a single argument, which is an object 
    destructuring pattern:


    function ({id, name, date_added}) {
        // ... code inside the callback function
    }

    This pattern is used to extract the id, name, and date_added properties from each 
    element of the data array. The callback function is then executed for each element
    in the array, and within the function, you can access these properties directly 
    as variables (id, name, and date_added).

    
    In summary, the forEach method is a convenient way to iterate over each element in 
    an array and perform some operation or execute a function for each element. 
    The provided callback function is what gets executed for each element in the 
    data array.
    */

    let tableHtml = "";
    data.forEach(function ({userid, firstname, lastname, salary, age, registerday, signintime}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${userid}</td>`;
         tableHtml +=`<td>${firstname}</td>`;
         tableHtml +=`<td>${lastname}</td>`;
         tableHtml +=`<td>${salary}</td>`;
         tableHtml +=`<td>${age}</td>`;
         tableHtml +=`<td>${new Date(registerday).toLocaleString()}</td>`;
         tableHtml +=`<td>${new Date(signintime).toLocaleString()}</td>`;
         tableHtml +=`<td><button class="delete-row-btn" data-id=${userid}>Delete</td>`;
         tableHtml +=`<td><button class="edit-row-btn" data-id=${userid}>Edit</td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
