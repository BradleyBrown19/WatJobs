
let state = {
    1: "Applied",
    2: "Selected for Interview",
    3: "Rejected",
    4: "Offered",
}

class Job {

    constructor(company, position, city, salary, rating) {
        this.company = company;
        this.position = position;
        this.city = city;
        this.salary = salary;
        this.rating = rating;
        this.state = 1;
        this.dateCreated = new Date();
        this.jobDiv = null;
    }

    getHTML() {
        return `<p>Company: ${this.company} <br/> Position: ${this.position} <br/> City: ${this.city} <br/> Ranking: ${this.rating} <br/> Pay: ${this.salary} <br/> Status: ${state[this.state]}</p> <button type="button" id="${this.company}" class="delete-button" onclick="sayHi()">Delete</button>`;
    }

    setJobDiv(jobDiv) {
        this.jobDiv = jobDiv;
    }

};


$(document).on('click', '.delete-button', function() {

    let deleteJob = this.parentNode;
    
    for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].jobDiv == deleteJob) {
            jobs.splice(i,1);
        }
    }

    deleteJob.remove();
});


//Initializing variables and getting elements
let jobs = [];
let queriedJobs = [];
let list = document.getElementById('list');
let btn = document.getElementById('submit');
let changeMenu = document.getElementById('change-menu');
let addJobMenu = document.getElementById('form');
let sortJobMenu = document.getElementById('sort-menu');
let menuTitle = document.getElementById('menu-title');
let onAddJob = true;
let jobSearch = document.getElementById('search-input');
let classMap = new Map();
let username = document.getElementById('usernameBox');

alert(transfer);

//Toggle between add jobs and sort jobs
/*
changeMenu.addEventListener('click', function() {
    if (onAddJob) {
        changeMenu.innerHTML = "Add Job";
        onAddJob = false;
        addJobMenu.style.display = 'none';
        sortJobMenu.style.display = 'block';
        menuTitle.innerHTML = "Sort Jobs";

    } else {
        changeMenu.innerHTML = "Sort Jobs";
        onAddJob = true;
        addJobMenu.style.display = 'block';
        menuTitle.innerHTML = "Add Job";
        sortJobMenu.style.display = "none";
        jobSearch.value = "";
        filterJobs();
    }
});
*/

//adding new jobs
btn.addEventListener('click', function() {
    let newComp = document.getElementById('company').value;
    let newPos = document.getElementById('position').value;
    let newLoc = document.getElementById('location').value;
    let newSal = document.getElementById('salary').value;
    let newRank = document.getElementById('ranking').value;
    let deleteButtons = document.getElementsByClassName('delete-buttons');

    jobs.unshift(new Job(newComp, newPos, newLoc, newSal, newRank));
    showJobs(jobs);
});

function showJobs(jobs) {
    list.innerHTML = "";
    for (let job of jobs) {
        let jobDiv = document.createElement('div');
        jobDiv.className = "container border rounded m-t-50 jobDiv"
        jobDiv.innerHTML = job.getHTML();
        job.setJobDiv(jobDiv);
        classMap.set(jobDiv, job);
        list.appendChild(jobDiv);
        filterJobs();
    }
}

function sortStrings(a, b) {
    jobs.sort(function(a,b) {
        let nameA = a.company.toLowerCase(), nameB = b.company.toLowerCase();
        if (nameA > nameB) {
            return 1;
        } else {
            return -11;
        }
    });
}

function sortJobs(nameA, nameB) {
    if (nameA > nameB) {
        return 1;
    } else {
        return -1;
    }
}

function sortByComp() {
    jobs.sort(function(a,b) {
        return sortJobs(a.company.toLowerCase(), b.company.toLowerCase());
    });
    
    showJobs(jobs);
}

function sortByPos() {
    jobs.sort(function(a,b) {
        return sortJobs(a.position.toLowerCase(), b.position.toLowerCase());
    });
    
    showJobs(jobs);
}

function sortByLoc() {
    jobs.sort(function(a,b) {
        return sortJobs(a.location.toLowerCase(), b.location.toLowerCase());
    });
    
    showJobs(jobs);
}

function sortBySal() {
    jobs.sort(function(a,b) {
        return b.salary-a.salary;
    });
    
    showJobs(jobs);
}

function sortByRank() {
    jobs.sort(function(a,b) {
        return b.rating-a.rating;
    });
    
    showJobs(jobs);
}

//Search box filtering
function filterJobs() {
    let filter = jobSearch.value.toLowerCase();
    for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].company.toLowerCase().indexOf(filter) > -1) {
            jobs[i].jobDiv.style.display = 'block';
        } else if(jobs[i].position.toLowerCase().indexOf(filter) > -1) {
            jobs[i].jobDiv.style.display = 'block';
        } else if(jobs[i].city.toLowerCase().indexOf(filter) > -1) {
            jobs[i].jobDiv.style.display = 'block';
        } else {
            jobs[i].jobDiv.style.display = 'none';
        }
    }
}




