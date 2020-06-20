const { ipcRenderer, BrowserWindow, remote } = require("electron");

const Store = require('electron-store');
const store = new Store();

const tasksList = document.getElementById('myTasks');

let tasks = []; //stores the tasks of the window
let tags = ['', 'work', 'leisure', 'swag', 'dab']; 
let projects = ['', 'work on my bicep curls',
    'dab with ease', 'blender project', 'swag project'];

// adds the tags to the drop down box
function loadTags(){
    let dropDownBox = document.getElementById('tag');
    dropDownBox.innerHTML = ''; //clears it before adding all the tags
    for (let i=0; i < tags.length; ++i){
        let currentTag = tags[i];
        let element = document.createElement("option");
        element.text = currentTag;
        element.value = currentTag;
        dropDownBox.add(element);
    }
}
loadTags();
// adds the projects to the respective drop down box
function loadProjects(){
    let dropDownBoxProject = document.getElementById('project');
    dropDownBoxProject.innerHTML = ''; //clears it before adding all the projects
    for (let i=0; i < projects.length; ++i){
        let currentTag = projects[i];
        let element = document.createElement("option");
        element.text = currentTag;
        element.value = currentTag;
        dropDownBoxProject.add(element);
    }
}
loadProjects();

class Task{
    constructor(tag, project, description, isBillable, startTime, endTime){
        this.tag = tag;
        this.project = project;
        this.description = description;
        this.isBillable = isBillable;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

function addTag(newTag){
    if (newTag !== '') tags.push(newTag);
    loadTags();
}
function deleteTag(tagName){
    let index = tags.indexOf(tagName);
    if (index > -1 && tagName !== '') {
       tags.splice(index, 1);
    }
    loadTags();
}
function addProject(newProject){
    if (newProject !== '') projects.push(newProject);
    loadProjects();
}
function deleteProject(projectName){
    let index = projects.indexOf(projectName);
    if (index > -1 && projectName !== '') {
       projects.splice(index, 1);
    }
    loadProjects();
}

const addTagForm = document.forms['addTag'];
addTagForm.addEventListener('submit', function(){
    event.preventDefault();
    const currentTag = document.querySelector('#addedTag').value;
    addTag(currentTag);
    document.getElementById('addTag').reset();
});
const deleteTagForm = document.forms['deleteTag'];
deleteTagForm.addEventListener('submit', function(){
    event.preventDefault();
    const currentTag = document.querySelector('#deletedTag').value;
    deleteTag(currentTag);
    document.getElementById('deleteTag').reset();
});

const addProjectForm = document.forms['addProject'];
addProjectForm.addEventListener('submit', function(){
    event.preventDefault();
    const currentProject = document.querySelector('#addedProject').value;
    addProject(currentProject);
    document.getElementById('addProject').reset();
});
const deleteProjectForm = document.forms['deleteProject'];
deleteProjectForm.addEventListener('submit', function(){
    event.preventDefault();
    const currentProject = document.querySelector('#deletedProject').value;
    deleteProject(currentProject);
    document.getElementById('deleteProject').reset();
});

//when the form is submitted, its contents are added to the array and displayed
const timeBlockForm = document.forms['myForm'];
timeBlockForm.addEventListener('load', setFormDefaults());
timeBlockForm.addEventListener('submit', function(){
    event.preventDefault(); //necessary, it prevents the window from removing the contents
    addTask();
    displayTasks();
    setFormDefaults();
});

//defaults the start time to right now
function getCurrentDate(){
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}
function setFormDefaults(){
    document.getElementById('startTime').value = getCurrentDate();
}
function FormatDateForDisplay (date) {
    return date.substr(date.length - 5);
}


// this function adds the form contents to the task array that stores the data
function addTask(){
    tasksList.appendChild(document.createElement('hr'));
    const tag = document.querySelector('#tag').value;
    const project = document.querySelector('#project').value;
    const descriptionText = document.querySelector('#description').value;
    const billable = document.querySelector('#billable').checked;
    const startTime = document.querySelector('#startTime').value;
    const endTime = document.querySelector('#endTime').value;

    const taskFromForm = new Task(tag, project, descriptionText,
        billable, startTime, endTime);
    
    tasks.push(taskFromForm);
    document.getElementById("myForm").reset();
}

function removeAtIndex(index){
    tasks.splice(index, 1);
    displayTasks();
}

//adds the current date and time as an endTime to a task stored in tasks
function addEndDate(index){
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    console.log(now.toISOString().slice(0, 16));
    console.log(tasks);
    tasks[index]['endTime'] = now.toISOString().slice(0, 16);
    displayTasks();
}

// this function shows all the tasks that are in the task array
function displayTasks(e) {
    tasksList.innerHTML = '';
    for (let i = 0; i < tasks.length; ++i)
    {
        let currentTask = tasks[i];
        const li = document.createElement('li');

        if(currentTask.tag != '') {
            li.appendChild(document.createTextNode(currentTask.tag));
            li.appendChild(document.createElement('br'));
        }
        if(currentTask.project != '') {
            li.appendChild(document.createTextNode(currentTask.project));
            li.appendChild(document.createElement('br'));
        }
        if(currentTask.description != '') {
            li.appendChild(document.createTextNode(currentTask.description));
            li.appendChild(document.createElement('br'));
        }

        //shows whether the time is billable or not
        if (currentTask.isBillable) {
            li.appendChild(document.createTextNode('This time is billable'));
            li.append(document.createElement('br'));
        }

        let displayDate = FormatDateForDisplay(currentTask.startTime);
        displayDate += (currentTask.endTime !== '') ? ' - ' + FormatDateForDisplay(currentTask.endTime) : ''; 
        li.appendChild(document.createTextNode(displayDate));

        //puts a button to finish a task that gives the date now
        if (currentTask.endTime === '') {
            li.appendChild(document.createElement('br'));
            let finishTaskButton = document.createElement('BUTTON');
            finishTaskButton.append(document.createTextNode('finish task'));
            finishTaskButton.setAttribute('onClick', `addEndDate(${i})`);
            li.appendChild(finishTaskButton);
        }

        // initialises the delete button for each task
        li.appendChild(document.createElement('br'));
        let deleteButton = document.createElement('BUTTON');
        deleteButton.append(document.createTextNode('delete task'));
        deleteButton.setAttribute('onClick', `removeAtIndex(${i})`);
        li.appendChild(deleteButton);

        tasksList.appendChild(li);
        tasksList.appendChild(document.createElement('hr')); //adds a horizontal line
    }
}



//! BELOW ARE EVENT HANDLERS FOR EVENTS SENT FROM main.js

//removes all the tasks displayed when main.js sends the event
ipcRenderer.on('itemsClear', function(){
    tasksList.innerHTML = '';
    tasks = [];
});

// saves the files and notifies main.js that it's complete
ipcRenderer.on('saveTasks', () => {
    saveFiles();
    ipcRenderer.send('saveComplete');
});

ipcRenderer.on('loadTasks', () => {
    tasks = store.get('tasks');
    tags = store.get('tags');
    projects = store.get('projects');
    loadTags();
    loadProjects();
    displayTasks();
});

function saveFiles(){
    store.set('tasks', tasks);
    store.set('tags', tags);
    store.set('projects', projects);
}