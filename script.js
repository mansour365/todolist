
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
//getDatabase needed access the firebase database
//ref needed to access the specific folder in the database
//push needed to push a value to the folder on database
//onValue method will run anytime an edit is made to the database
import {getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

//these app settings fields are needed to craete an app object
//the app object will be created with the initializeApp function
const appSettings = {
    databaseURL: "https://to-do-list-8f2ea-default-rtdb.firebaseio.com/"
}

//Create the firebase app using the appSettings (creates a link to firebase)
const app = initializeApp(appSettings);
//get access to the firebase database
const database = getDatabase(app);
//get access to a folder on the database
const tasksInDB = ref(database, "tasks");


//HTML Elements
const inputFieldEl = document.getElementById("input-field");
const addBtnEl = document.getElementById("add-button");
const taskListEL = document.getElementById("task-list");

//this function runs everytime there is an edit to the database
//first argument is folder in database, next argument is a function that receives a snapshot of the database
onValue(tasksInDB, function(snapshot){
    //Using Objects.values() we can take the firebase snapshot object and convert to array
    //We can use Object.keys, Object.values or Object.entries
    let tasksArray = Object.values(snapshot.val());
    //Clear the current HTML list, because we will update with new list
    clearTasksListEL();
    //Create a new HTML list using the array we aquired
    for(let i = 0; i < tasksArray.length ; i++){
        appendTaskToTaskListEl(tasksArray[i]);
    }
})

function clearTasksListEL(){
    taskListEL.innerHTML = '';
}

function handleNewTask(){
    let inputValue = inputFieldEl.value;
    //push the input value to the database
    push(tasksInDB, inputValue);
    //clear input field when add button is pressed
    clearInputFieldEl();
    //add new task to page
    //appendTaskToTaskListEl(inputValue);
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