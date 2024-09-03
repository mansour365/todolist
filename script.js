import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
//getDatabase needed access the firebase database
//ref needed to access the specific folder in the database
//push needed to push a value to the folder on database
//onValue method will run anytime an edit is made to the database
import {getDatabase, ref, push, update, onValue, remove} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const twoSection = document.getElementById("two-section");

const inputFieldEl = document.getElementById("input-field");
const addBtnEl = document.getElementById("addTaskBtn");
const taskListEl = document.getElementById("task-list");
const taskCountEl = document.getElementById("taskCountArea");

const menuBtnEl = document.getElementById("menu");
const sidebarEl = document.getElementById("sidebar");
const trashBtnEl = document.getElementById("removeAll-button"); /*Button to remove all entries*/
const darkAreaEl = document.getElementById("deleteListOverlay"); /*dark area when overlay happens*/
const deleteBtnEl = document.getElementById("Delete-btn"); /*final delete button to delete the list*/

const homeBtnEl = document.getElementById("homeBtn");
const accountBtnEl = document.getElementById("accountBtn");
const darkModeBtnEl = document.getElementById("darkModeBtn");
const aboutBtnEl = document.getElementById("aboutBtn");

const optionBtn = document.querySelector(".options-btn");






const login = false;
if(login == true){
    //hide login card
    document.getElementById("loginCard").style.display="none";

    //show other elements
    document.getElementById("sidebar").style.display="flex";
    document.getElementById("taskArea").style.display="flex";
    document.getElementById("inputArea").style.display="flex";
    document.getElementById("task-header").style.display="flex";
}




trashBtnEl.onclick = function(){
    on();
}

//if you click on anything other than delete it will cancel
//Not ideal
//ideally clicking on that white card should not do anything
darkAreaEl.onclick = function(){
    off();
}

deleteBtnEl.onclick = function(){
    remove(ref(database, `tasks`));
}

menuBtnEl.onclick = function(){
    sidebarEl.classList.toggle("active")
}



homeBtnEl.onclick = function(){
    //top bar
    document.getElementById("title").innerHTML = "To-Do List";
    document.getElementById("taskCountArea").style.display="block";
    document.getElementById("removeAll-button").style.display="block";
    document.getElementById("logout-button").style.display="none";
    //action zone
    document.getElementById("account-zone").style.display="none";
    document.getElementById("darkMode-zone").style.display="none";
    document.getElementById("about-zone").style.display="none";
    document.getElementById("task-list").style.display="flex";
    //button color
    if(homeBtnEl.classList == "active"){
        return; //do nothing
    }
    else{
        homeBtnEl.classList.toggle("active");
        aboutBtnEl.classList.remove("active");
        accountBtnEl.classList.remove("active");
    }


}

accountBtnEl.onclick = function(){
    //top bar
    document.getElementById("title").innerHTML = "Account";
    document.getElementById("taskCountArea").style.display="none";
    document.getElementById("removeAll-button").style.display="none";
    document.getElementById("logout-button").style.display="block";

    //action zone
    document.getElementById("task-list").style.display="none";
    document.getElementById("darkMode-zone").style.display="none";
    document.getElementById("about-zone").style.display="none";
    document.getElementById("account-zone").style.display="block";
    //button color
    if(accountBtnEl.classList == "active"){
        return; //do nothing
    }
    else{
        accountBtnEl.classList.toggle("active");
        aboutBtnEl.classList.remove("active");
        homeBtnEl.classList.remove("active");
    }
    
}

darkModeBtnEl.onclick = function(){
    //if dark mode is already active, turn it off
    if(darkModeBtnEl.classList == "active"){
        darkModeBtnEl.classList.remove("active");/*dark mode button*/
        twoSection.classList.remove("darkMode"); /*background color*/
        sidebarEl.classList.remove("darkMode"); /*sidebar*/
    }
    //Otherwise turn dark mode on
    else{
        darkModeBtnEl.classList.toggle("active");/*dark mode button*/
        twoSection.classList.toggle("darkMode");/*background color*/
        sidebarEl.classList.toggle("darkMode"); /*sidebar*/
    }
}

aboutBtnEl.onclick = function(){
    //top bar
    document.getElementById("title").innerHTML = "About";
    document.getElementById("taskCountArea").style.display="none";
    document.getElementById("removeAll-button").style.display="none";
    document.getElementById("logout-button").style.display="none";

    //action zone
    document.getElementById("task-list").style.display="none";
    document.getElementById("account-zone").style.display="none";
    document.getElementById("darkMode-zone").style.display="none";
    document.getElementById("about-zone").style.display="block";
    //button color
    if(aboutBtnEl.classList == "active"){
        return; //do nothing
    }
    else{
        aboutBtnEl.classList.toggle("active");
        homeBtnEl.classList.remove("active");
        accountBtnEl.classList.remove("active");
    }
}



/*todayDate(); //Show current date on page load*/

let taskCount = 0;


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
            taskCount++;
        }
        taskCounterFunc();
    }
    else{
        //In this case no snapshots exist so display no more tasks.
        taskListEl.innerHTML = "No more tasks. ";
        taskCounterFunc();
    }

})

function clearTasksListEL(){
    taskListEl.innerHTML = '';
}

function handleNewTask(){
    let inputValue = inputFieldEl.value;
    //Don't push if input is empty
    if(inputValue == ""){
        return;
    }
    //Temporary
    let date = todayDate();
    let checked = false;
    //push the input value to the database
    /*push(tasksInDB, inputValue);*/
    push(tasksInDB, [inputValue, date, checked]);
    //clear input field when add button is pressed
    clearInputFieldEl();
}

//function to clear input field
function clearInputFieldEl(){
    inputFieldEl.value='';
}


    
//function to add new task to the page
function appendTaskToTaskListEl(item){
    let itemID = item[0];  /*ID of the item*/
    let itemValue = item[1]; /*ItemValue will be an array, [the task, date] */

    let newEl = document.createElement("li"); //Create an "li" element
    newEl.classList.add('list-element'); 

    let rightEl = `<div class="right-portion">
                        <button class="options-btn" id="${itemID}" onclick="handleOptionBtn(this.id)">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>`;

    if(itemValue[2] == true){
        newEl.innerHTML += `<div class="left-portion" onclick="handleLeft('${itemID}', ${itemValue[2]})">
                                <div class="check-portion">
                                    <span class="material-symbols-outlined">task_alt</span>
                                </div> 
                                <div class="text-portion">
                                    <div class="title-portion-strike">${itemValue[0]}</div>
                                    <div class="date-portion">${itemValue[1]}</div>
                                </div> 
                            </div>` + rightEl;
    }
    else{
        newEl.innerHTML += `<div class="left-portion" onclick="handleLeft('${itemID}', ${itemValue[2]})">
                                <div class="check-portion">
                                    <span class="material-symbols-outlined">radio_button_unchecked</span>
                                </div> 
                                <div class="text-portion">
                                    <div class="title-portion">${itemValue[0]}</div>
                                    <div class="date-portion">${itemValue[1]}</div>
                                </div> 
                            </div>` + rightEl;
    }
    
    taskListEl.append(newEl); //append the "li" element to the list
}


//Function that removes a task from database
window.handleOptionBtn = (theID) => {
    let exactLocationOfItemInDB = ref(database, `tasks/${theID}`);
    remove(exactLocationOfItemInDB);
}


//function that marks a task as checked or unchecked
window.handleLeft = (someID, strikethrough) => {
    let exactLocationOfItemInDB = ref(database, `tasks/${someID}`);
    if(strikethrough == false){
        update(exactLocationOfItemInDB, {2:true});
    }
    else{
        update(exactLocationOfItemInDB, {2:false});
    }
}



function todayDate(){
    const d = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    let day = days[d.getDay()];
    let month = months[d.getMonth()];
    let dateNum = d.getDate();
    let year = d.getFullYear();

    return `${day},  ${month} ${dateNum} ${year}`;
}

function taskCounterFunc(){
    if(taskCount == 1){
        taskCountEl.innerHTML = `<p>1 Task</p>`;
    }
    else{
        taskCountEl.innerHTML = `<p>${taskCount} Tasks</p>`;
    }
    //reset the taskcount after it's added to html
    taskCount = 0;
}


function on() {
    document.getElementById("deleteListOverlay").style.display = "block";
}
  
function off() {
    document.getElementById("deleteListOverlay").style.display = "none";
} 




//Event listener if click the "Add Task" button
addBtnEl.addEventListener("click", handleNewTask, false);
//Event listener if press the "Enter" key
inputFieldEl.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        handleNewTask();
    }
})


