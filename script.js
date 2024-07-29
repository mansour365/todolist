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
const addBtnEl = document.getElementById("addTaskBtn");
const taskListEL = document.getElementById("task-list");
const taskCountEl = document.getElementById("taskCountArea");

const menuBtnEl = document.getElementById("menu");
const sidebarEl = document.getElementById("sidebar");
const trashBtnEl = document.getElementById("removeAll-button"); /*Button to remove all entries*/
const darkAreaEl = document.getElementById("deleteListOverlay"); /*dark area when overlay happens*/
const deleteBtnEl = document.getElementById("Delete-btn"); /*final delete button to delete the list*/

const homeBtnEl = document.getElementById("home");
const accountBtnEl = document.getElementById("account");
const darkModeBtnEl = document.getElementById("darkMode");
const aboutBtnEl = document.getElementById("about");
const listEl = document.getElementsByClassName("list-element");


const login = true;
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
    //action zone
    document.getElementById("account-zone").style.display="none";
    document.getElementById("darkMode-zone").style.display="none";
    document.getElementById("about-zone").style.display="none";
    document.getElementById("task-list").style.display="flex";
    //button color
    if(homeBtnEl.classList == "active")
    {
        return; //do nothing
    }
    else{
        homeBtnEl.classList.toggle("active");
        aboutBtnEl.classList.remove("active");
        darkModeBtnEl.classList.remove("active");
        accountBtnEl.classList.remove("active");
    }


}

accountBtnEl.onclick = function(){
    //top bar
    document.getElementById("title").innerHTML = "Account";
    document.getElementById("taskCountArea").style.display="none";
    document.getElementById("removeAll-button").style.display="none";
    //action zone
    document.getElementById("task-list").style.display="none";
    document.getElementById("darkMode-zone").style.display="none";
    document.getElementById("about-zone").style.display="none";
    document.getElementById("account-zone").style.display="block";
    //button color
    if(accountBtnEl.classList == "active")
    {
        return; //do nothing
    }
    else{
        accountBtnEl.classList.toggle("active");
        aboutBtnEl.classList.remove("active");
        darkModeBtnEl.classList.remove("active");
        homeBtnEl.classList.remove("active");
    }
    
}

darkModeBtnEl.onclick = function(){
    document.getElementById("sidebar").style.backgroundColor="var(--backColorDark)";
    document.getElementById("mainarea").style.backgroundColor="var(--backColorDark)";
    document.getElementById("taskArea").style.backgroundColor="var(--taskBackColorDark)";
    document.getElementById("task-header").style.backgroundColor="var(--headerColorDark)";
    /*document.getElementsByClassName("list-element").style.backgroundColor="var(--taskColorDark)";*/
    /*listEl.classList.toggle("active");*/

    /*change all text color for dark mode*/
    document.getElementById("menu").style.color="var(--subTextDark)";
    document.getElementById("home").style.color="var(--subTextDark)";
    document.getElementById("account").style.color="var(--subTextDark)";
    document.getElementById("darkMode").style.color="var(--subTextDark)";
    document.getElementById("about").style.color="var(--subTextDark)";

    /*Add task button */
    document.getElementById("addTaskBtn").style.color="var(--mainTextDark)";
    document.getElementById("addTaskBtn").style.backgroundColor="darkgreen"; /*temp*/

    /*task header area*/
    document.getElementById("task-header").style.backgroundColor="var(--headerColorDark)";
    document.getElementById("title").style.color="var(--mainTextDark)";
    document.getElementById("taskCountArea").style.color="var(--subTextDark)";

    /*toggle "on" dark mode for the list*/
    taskListEL.classList.toggle("darkMode");

   


    //button color
    if(darkModeBtnEl.classList == "active")
    {
        return; //do nothing
    }
    else{
        darkModeBtnEl.classList.toggle("active");
        aboutBtnEl.classList.remove("active");
        homeBtnEl.classList.remove("active");
        accountBtnEl.classList.remove("active");
    }

    
}

aboutBtnEl.onclick = function(){
    //top bar
    document.getElementById("title").innerHTML = "About";
    document.getElementById("taskCountArea").style.display="none";
    document.getElementById("removeAll-button").style.display="none";
    //action zone
    document.getElementById("task-list").style.display="none";
    document.getElementById("account-zone").style.display="none";
    document.getElementById("darkMode-zone").style.display="none";
    document.getElementById("about-zone").style.display="block";
    //button color
    if(aboutBtnEl.classList == "active")
    {
        return; //do nothing
    }
    else{
        aboutBtnEl.classList.toggle("active");
        homeBtnEl.classList.remove("active");
        accountBtnEl.classList.remove("active");
        darkModeBtnEl.classList.remove("active");
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
        taskListEL.innerHTML = "No more tasks. ";
        taskCounterFunc();
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
    //Temporary
    let date = todayDate();
    //push the input value to the database
    /*push(tasksInDB, inputValue);*/
    push(tasksInDB, [inputValue, date]);
    //clear input field when add button is pressed
    clearInputFieldEl();
}

//function to clear input field
function clearInputFieldEl(){
    inputFieldEl.value='';
}

//function to add new task to the page
function appendTaskToTaskListEl(item){
    let itemID = item[0];
    let itemValue = item[1]; /*ItemValue will be an array, [the task, date] */

    let newEl = document.createElement("li"); //Create an "li" element
    newEl.classList.add('list-element');
    /*newEl.textContent = itemValue;  //Put the value argument inside the "li" element*/
    newEl.innerHTML += `<div class="left-portion">
                            <div class="title-portion">${itemValue[0]}</div>
                            <div class="date-portion">${itemValue[1]}</div>
                        </div>
                        <div class="right-portion">
                            <button class="options-btn">
                                <span class="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>`;

    //Event listener that checks if any element was clicked on and the removes it
    newEl.addEventListener("click", function(){
        //exact location (ref followed by the databse, followed by the location of ID)
        let exactLocationOfItemInDB = ref(database, `tasks/${itemID}`);
        //A firebase function that takes an exact location and deletes that item
        newEl.style.textDecoration="line-through";
        //Add some delay
        var delayInMilliseconds = 1000; //1 second
        setTimeout(function() {
            remove(exactLocationOfItemInDB); //remove the task from the database
        }, delayInMilliseconds);

        
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




//Event listener if click the "+" button
addBtnEl.addEventListener("click", handleNewTask, false);
//Event listener if press the "Enter" key
inputFieldEl.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        handleNewTask();
    }
})


