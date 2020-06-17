const { ipcRenderer } = require("electron");

const ul = document.getElementById('myList');

let tasks = [];


//when the form is submitted, its contents are added to the array and displayed
const form = document.forms['myForm'];
form.addEventListener('submit', function(){
    event.preventDefault();
    addTask();
    updateDisplay();
});
//defaults the start time to right
function setDefaultTimeToNow(){
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('startTime').value = now.toISOString().slice(0, 16);
}
form.addEventListener('load', setDefaultTimeToNow);
form.addEventListener('submit', setDefaultTimeToNow);


// this function adds the form contents to the task array that stores the data
function addTask(){
    ul.appendChild(document.createElement('hr'));
    const taskText = document.querySelector('#task').value;
    const tagText = document.querySelector('#tag').value;
    const descriptionText = document.querySelector('#description').value;
    const billable = document.querySelector('#billable').checked;
    const startTime = document.querySelector('#startTime').value;
    const endTime = document.querySelector('#endTime').value;

    const taskBlock = [
        taskText, tagText, descriptionText,
        billable, startTime, endTime
    ];
    
    tasks.push(taskBlock);
    document.getElementById("myForm").reset();
}

function removeFromForm(){
    const delForm = document.forms['delete'];
    const num = delForm.querySelector('#deleteNum').value;
    document.getElementById("delete").reset();
    removeTask(num);
}

function removeTask(index){
    tasks.splice(index, 1);
    updateDisplay();
}

// this function shows all the tasks that are in the task array
function updateDisplay(e) {
    ul.innerHTML = '';
    for (let i = 0; i < tasks.length; ++i)
    {
        let taskBlock = tasks[i];
        const li = document.createElement('li');

        //shows the tasks till billable
        for(let j = 0; j < 3; ++j) { 
            let text = document.createTextNode(taskBlock[j]);
            li.appendChild(text);
            if (taskBlock[j] != '') {
                li.appendChild(document.createElement('br'));
            }
        }

        //shows whether the time is billable or not
        if (taskBlock[3]) {
            li.appendChild(document.createTextNode('It is billable'));
        }
        else {
            li.appendChild(document.createTextNode('It is not billable...'));
        }
        li.append(document.createElement('br'));

        li.appendChild(document.createTextNode(taskBlock[4]));
        li.appendChild(document.createElement('br'));
        li.appendChild(document.createTextNode(taskBlock[5]));

        ul.appendChild(li);
        ul.appendChild(document.createElement('hr')); //adds a horizontal line
    }
}

//removes all the tasks displayed when main.js sends the event
ipcRenderer.on('itemsClear', function(){
    ul.innerHTML = '';
    tasks = [];
});
