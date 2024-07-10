
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const appSettings = {
    databaseURL: "https://to-do-list-8f2ea-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const tasksInDB = ref(database, "tasks");

const inputFieldEl = document.getElementById("input-field");
const addBtnEl = document.getElementById("add-button");
const taskListEL = document.getElementById("task-list");

onValue(tasksInDB, function(snapshot){
    let tasksArray = Object.values(snapshot.val());
    console.log(tasksArray);

    for(let i = 0; i < tasksArray.length ; i++)
    {
        console.log("this is the "+i+"th entry")
        console.log(tasksArray[i]);
        appendTaskToTaskListEl(tasksArray[i]);
    }
})




function handleNewTask(){
    let inputValue = inputFieldEl.value;
    //push the input value to the database
    push(tasksInDB, inputValue);
    //clear input field when add button is pressed
    clearInputFieldEl();
    //add new task to page
    appendTaskToTaskListEl(inputValue);
}


//function to clear input field
function clearInputFieldEl(){
    inputFieldEl.value='';
}

//function to add new task to the page
function appendTaskToTaskListEl(someValue){
    taskListEL.innerHTML += `<li>${someValue}</li>`;
}

let Users = {
    "00":"sindra@scrimba.com",
    "01":"per@scrimba.com",
    "02":"frode@scrimba.com"
}

let UserEmails = Object.values(Users); //array of emails

let UserIDs = Object.keys(Users); //array of keys

let UserEntries = Object.entries(Users); //entries


console.log(UserEmails)
console.log(UserIDs)
console.log(UserEntries)


















addBtnEl.addEventListener("click", handleNewTask, false);