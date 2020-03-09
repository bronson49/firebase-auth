import './style.css'


function getData(token) {
    return fetch(`https://test-b8c90.firebaseio.com/t1.json?auth=${token}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

function getUserInfo(token, id) {
    return fetch(`https://test-b8c90.firebaseio.com/users/${id}.json?auth=${token}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => console.log(err));
}

function authWithEmailAndPassword(email, password) {
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            email, password,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok){
                return response.json();
            }else {
                return Promise.reject(response)
            }
        })
        .then(data => data)
}

function createUser(email, pass, name) {
    const auth = firebase.auth();
    return auth.createUserWithEmailAndPassword(email, pass)
        .then(res => {
            console.log('create User');
            console.log(res);
            return authWithEmailAndPassword(email, pass);
        })
        .then(data => {
            console.log(data);
            return addUserData(name, data.localId, data.idToken);
        })
        .catch(err => console.log(err))
}

function addUserData(name, id, token) {
    console.log('id ', id);
    return fetch(`https://test-b8c90.firebaseio.com/users/${id}.json?auth=${token}`, {
        method: 'PUT',  // IMPORTANT !!!
        body: JSON.stringify({name, id,}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log('add User Data');
            console.log(response);
            return response;
        })
}



document.forms['create'].addEventListener('submit', function (e) {
    e.preventDefault();
    createUser(this['email'].value, this['pass'].value, this['userName'].value)
        .then(response => {
            document.getElementById('log').innerHTML = `
               <p>Sign in success!</p>
               <p>Hello ${response.name}</p>
            `;
        });
});

document.forms['login'].addEventListener('submit', function (e) {
    e.preventDefault();
    authWithEmailAndPassword(this['email'].value, this['pass'].value)
        .then(res => {
            return getUserInfo(res.idToken, res.localId);
        })
        .then(response => {
            document.getElementById('log').innerHTML = `
               <p>Logged in success!</p>
               <p>your name = ${response.name}</p>
            `;
        })
        .catch(error=>{
            error.json().then(err=>{
                document.getElementById('log').innerHTML = `
               <p>Fatal error</p>
               <p>${err.error.message}</p>
            `;
            });
        });
});

