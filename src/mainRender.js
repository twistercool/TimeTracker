const { ipcRenderer } = require("electron");

const ul = document.getElementById('myList');

let tasks = []; //stores the tasks of the window
let tags = ['work', 'leisure', 'swag', 'dab']; 

// adds the tags to the drop down box
let dropDownBox = document.getElementById('tag');
for (let i=0; i < tags.length; ++i){
    // dropDownBox.
    let currentTag = tags[i];
    let element = document.createElement("option");
    element.text = currentTag;
    element.value = currentTag;
    dropDownBox.add(element);
}

class Task{
    constructor(task, tag, description, isBillable, startTime, endTime){
        this.task = task;
        this.tag = tag;
        this.description = description;
        this.isBillable = isBillable;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

//when the form is submitted, its contents are added to the array and displayed
const form = document.forms['myForm'];
form.addEventListener('submit', function(){
    event.preventDefault(); //necessary, it prevents the window from removing the contents
    addTask();
    updateDisplay();
    setFormDefaults();
});

//defaults the start time to right now
function setFormDefaults(){
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('startTime').value = now.toISOString().slice(0, 16);
}
form.addEventListener('load', setFormDefaults());


// this function adds the form contents to the task array that stores the data
function addTask(){
    ul.appendChild(document.createElement('hr'));
    const taskText = document.querySelector('#task').value;
    const tagText = document.querySelector('#tag').value;
    const descriptionText = document.querySelector('#description').value;
    const billable = document.querySelector('#billable').checked;
    const startTime = document.querySelector('#startTime').value;
    const endTime = document.querySelector('#endTime').value;

    const taskFromForm = new Task(taskText, tagText, descriptionText,
        billable, startTime, endTime);
    
    tasks.push(taskFromForm);
    document.getElementById("myForm").reset();
}

function removeFromForm(){
    const delForm = document.forms['delete'];
    const num = delForm.querySelector('#deleteNum').value;
    document.getElementById("delete").reset();
    tasks.splice(num, 1);
    updateDisplay();
}

// this function shows all the tasks that are in the task array
function updateDisplay(e) {
    ul.innerHTML = '';
    for (let i = 0; i < tasks.length; ++i)
    {
        let currentTask = tasks[i];
        const li = document.createElement('li');

        if(currentTask.task != '') {
            li.appendChild(document.createTextNode(currentTask.task));
            li.appendChild(document.createElement('br'));
        }
        if(currentTask.tag != '') {
            li.appendChild(document.createTextNode(currentTask.tag));
            li.appendChild(document.createElement('br'));
        }
        if(currentTask.description != '') {
            li.appendChild(document.createTextNode(currentTask.description));
            li.appendChild(document.createElement('br'));
        }

        //shows whether the time is billable or not
        if (currentTask.isBillable) {
            li.appendChild(document.createTextNode('It is billable'));
        }
        else {
            li.appendChild(document.createTextNode('It is not billable...'));
        }
        li.append(document.createElement('br'));

        li.appendChild(document.createTextNode(currentTask.startTime));
        li.appendChild(document.createElement('br'));
        li.appendChild(document.createTextNode(currentTask.endTime));

        ul.appendChild(li);
        ul.appendChild(document.createElement('hr')); //adds a horizontal line
    }
}

//removes all the tasks displayed when main.js sends the event
ipcRenderer.on('itemsClear', function(){
    ul.innerHTML = '';
    tasks = [];
});
