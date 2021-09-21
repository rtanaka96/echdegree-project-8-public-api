//get necessary DOM elements //
let employees = [];
let pulledEmployees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchBar = document.querySelector('#search');
let modalOpen = false;
const rightArrow = document.getElementById('right-arrow');
const leftArrow = document.getElementById('left-arrow');

//get and display 12 random users //

//fetch data from random user api
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .then(res => pulledEmployees = res)
    .catch(err => console.log(err));

//display employees
function displayEmployees(employeeData) {
    employees = employeeData;
    // store the employee HTML as we create it
    let employeeHTML = '';
    // loop through each employee and create HTML markup
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let state = employee.location.state;
        let picture = employee.picture;
        // template literals make this so much cleaner!
        employeeHTML += `
    <div class="card" data-index="${index}">
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}, ${state}</p>
    </div>
    </div>
    `
    });
    gridContainer.innerHTML = employeeHTML;
    return employees;
}

//display modal 
//save index
let modalIndex;
function displayModal(index) {
    //save index
    modalIndex = parseInt(index);
    // use object destructuring make our template literal cleaner
    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    <hr />
    <p>${phone}</p>
    <p class="address">${street.number} ${street.name}., ${state} ${postcode}</p>
    <p>Birthday:
    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;

    //prevent scroll when modal is open
    document.body.classList.add('noscroll');

    //set modal overlay var to true
    modalOpen = true;

    //add arrows depending on index //
    //hide arrows initially
    rightArrow.style.display = 'none';
    leftArrow.style.display = 'none';

    //helper fns to hide and show arrows
    function showArrow(dir) {
        let arrow = dir + '-arrow';
        let arrowElem = document.getElementById(arrow);
        arrowElem.style.display = 'block';
    }
    function hideArrow(dir) {
        let arrow = dir + '-arrow';
        let arrowElem = document.getElementById(arrow);
        arrowElem.style.display = 'none';
    }
    //show or hide arrows based on index
    if (modalIndex === 0) {
        showArrow('right');
        hideArrow('left');
    } else if (modalIndex === 11) {
        showArrow('left');
        hideArrow('right');
    } else {
        showArrow('left');
        showArrow('right');
    }
}

//add click event listener to grid container
gridContainer.addEventListener('click', e => {
    // make sure the click is not on the gridContainer itself
    if (e.target !== gridContainer) {
        // select the card element based on its proximity to actual element clicked
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');
        displayModal(index);
    }
});

//add click event listener to modal close button
modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
    document.body.classList.remove('noscroll');
    //set modal overlay var to false
    modalOpen = false;
});


//search function
function search(input) {
    //normalize query
    let query = input.toLowerCase();
    let matches = [];
    employees.forEach((employee) => {
        //normalize employee name for easier comparison
        let employeeName = employee.name.first.toLowerCase() + ' ' + employee.name.last.toLowerCase();
        //if employee name matches query, then add that employee to matches
        if (employeeName.includes(query)) {
            matches.push(employee);
        } else { //if not then remove them from matches
            let index = employees.indexOf(employee);
            matches.splice(index, 1);
        }
    });

    //display matched employee list if there is a query
    //display pulled employees otherwise :)
    if (query.length > 0) {
        displayEmployees(matches);
    } else {
        displayEmployees(pulledEmployees);
    }
}

//add event listener to search bar to search for results when typing
searchBar.addEventListener('keyup', (e) => {
    search(e.target.value);
});

//add event listener to form to search when form is submitted
searchBar.addEventListener('submit', (e) => {
    e.preventDefault();
    search(e.target.elements.search.value);
});

//swap between employees while modal is open
function modalSwap(dir) {
    if (modalIndex > 0 && dir === 'left') {
        displayModal(modalIndex - 1);
    } else if (modalIndex < 11 && dir === 'right') {
        displayModal(modalIndex + 1);
    }
}

document.addEventListener('keyup', (e) => {
    // if (modalOpen) {
    //     switch (e.key) {
    //         case 'ArrowLeft':
    //             if (modalIndex > 0) {
    //                 displayModal(modalIndex - 1);
    //             }
    //             break;
    //         case 'ArrowRight':
    //             if (modalIndex < 11) {
    //                 displayModal(modalIndex + 1);
    //             }
    //             break;
    //     }
    // }
    if (modalOpen) {
        switch(e.key) {
            case 'ArrowLeft':
                modalSwap('left');
                break;
            case 'ArrowRight':
                modalSwap('right');
                break;
        }
    }
});

rightArrow.addEventListener('click', () => {
    modalSwap('right');
});

leftArrow.addEventListener('click', () => {
    modalSwap('left');
});