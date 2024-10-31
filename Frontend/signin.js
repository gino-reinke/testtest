// // fetch call is to call the backend
// document.addEventListener('DOMContentLoaded', function() {
//     // one can point your browser to http://localhost:5000/getAll to check what it returns first.
//     fetch('http://localhost:5000/getAll')     
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
// });

document.getElementById('signup-btn').addEventListener('click', async () => {
    const user = {
        username: document.getElementById('signup-username').value,
        password: document.getElementById('signup-password').value,
        firstname: document.getElementById('signup-firstname').value,
        lastname: document.getElementById('signup-lastname').value,
        salary: document.getElementById('signup-salary').value,
        age: document.getElementById('signup-age').value,
        registerday: document.getElementById('signup-registerday').value,
        signintime: document.getElementById('signup-signintime').value,
        userid: document.getElementById('signup-userid').value,
    };

    const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    const data = await response.text();
    console.log(data);
});


document.getElementById('signin-btn').addEventListener('click', async () => {
    const user = {
        username: document.getElementById('signin-username').value,
        password: document.getElementById('signin-password').value,
    };

    const response = await fetch('http://localhost:5000/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            window.location.href = '../Frontend/index.html'; // Redirect to index.html
        } else {
            alert('Invalid username or password');
        }
    } else {
        alert('Sign-in failed. Please try again.');
    }
});


