
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
//getDatabase needed access the firebase database
//ref needed to access the specific folder in the database
//push needed to push a value to the folder on database
//onValue method will run anytime an edit is made to the database
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const dateAreaEl = document.getElementById("dateArea");

todayDate(); //Show current date on page load


//this function runs everytime there is an edit to the database
//first argument is folder in database, next argument is a function that receives a snapshot of the database
onValue(tasksInDB, function(snapshot){
    //First we check if snapshot exists. Otherwise we will just display no tasks yet.
    if(snapshot.exists()){
        //Using Objects.entries() we can take the firebase snapshot object and convert to array. 
        //This will be an array of key value pairs, so array of arrays.
        //We can use Object.keys, Object.values or Object.entries
        let tasksArray = Object.entries(snapshot.val());
        //Clear the current HTML list, because we will update with new list
        clearTasksListEL();
        //Create a new HTML list using the array we aquired
        for(let i = 0; i < tasksArray.length ; i++){
            let currentItem = tasksArray[i];
            //This currentItem is actually an array of [ID, task].
            //So we can check the ID and task sepreately later on ex. currentItem[0]

            appendTaskToTaskListEl(currentItem);
        }
    }
    else{
        //In this case no snapshots exist so display no more tasks.
        taskListEL.innerHTML = "No more tasks. ";
    }

})

function clearTasksListEL(){
    taskListEL.innerHTML = '';
}

function handleNewTask(){
    let inputValue = inputFieldEl.value;
    //Don't push if input is empty
    if(inputValue == ""){
        return;
    }
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
function appendTaskToTaskListEl(someItem){
    let itemID = someItem[0];
    let itemValue = someItem[1]; 

    let newEl = document.createElement("li"); //Create an "li" element
    newEl.textContent = itemValue;  //Put the value argument inside the "li" element

    //Event listener that checks if any element was clicked on and the removes it
    newEl.addEventListener("click", function(){
        //exact location (ref followed by the databse, followed by the location of ID)
        let exactLocationOfItemInDB = ref(database, `tasks/${itemID}`);
        //A firebase function that takes an exact location and deletes that item
        remove(exactLocationOfItemInDB);
    })

    taskListEL.append(newEl); //append the "li" element to the list
}


function todayDate(){
    const d = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    let day = days[d.getDay()];
    let month = months[d.getMonth()];
    let dateNum = d.getDate();
    let year = d.getFullYear();

    dateAreaEl.innerHTML = `<p>${day},  ${month} ${dateNum} ${year}</p>`;
}



//Event listener if click the "+" button
addBtnEl.addEventListener("click", handleNewTask, false);
//Event listener if press the "Enter" key
inputFieldEl.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        handleNewTask();
    }
})