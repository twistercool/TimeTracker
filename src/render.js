const {ipcRenderer} = require('electron');
        
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    // e.preventDefaults(); //might be useful but crashes the code
    const taskText = document.querySelector('#task').value;
    const tagText = document.querySelector('#tag').value;
    const descriptionText = document.querySelector('#description').value;
    const billableText = document.querySelector('#text').value;
    const startTime = document.querySelector('#startTime').value;
    const endTime = document.querySelector('#endTime').value;

    const taskBlock = [
        taskText, tagText, descriptionText,
        billableText, startTime, endTime
    ];
    // const
    ipcRenderer.send('task:add', taskBlock);
}