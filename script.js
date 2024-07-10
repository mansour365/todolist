
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getDatabase, ref, push} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const appSettings = {
    databaseURL: "https://to-do-list-8f2ea-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const tasksInDB = ref(database, "tasks");



const inputFieldEl = document.getElementById("input-field");
const addBtnEl = document.getElementById("add-button");



function handleNewTask(){
    let inputValue = inputFieldEl.value;

    push(tasksInDB, inputValue);
    console.log(inputValue);

        document.querySelector("task-list").innerHTML += inputFieldEl;


}




























addBtnEl.addEventListener("click", handleNewTask, false);