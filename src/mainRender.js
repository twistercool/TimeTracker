const form = document.forms['myForm']
form.addEventListener('submit', submitForm);

function submitForm(e) {
    event.preventDefault();
    const ul = document.getElementById('myList');
    ul.appendChild(document.createElement('hr'));

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
    
    const li = document.createElement('li');

    //shows the tasks till description
    for(let i = 0; i < 3; ++i) { 
        li.appendChild(document.createTextNode(taskBlock[i]));
        li.appendChild(document.createElement('br'));
    }

    //shows whether the time is billable or not
    if (taskBlock[3] === '1') {
        li.appendChild(document.createTextNode('It is indeed billable'));
    }
    else {
        li.appendChild(document.createTextNode('It appears this time is wasted and unfruitful...'));
    }
    li.append(document.createElement('br'));

    li.appendChild(document.createTextNode(taskBlock[4]));
    li.appendChild(document.createElement('br'));
    li.appendChild(document.createTextNode(taskBlock[5]));


    ul.appendChild(li);
    ul.appendChild(document.createElement('hr')); //adds a horizontal line

    document.getElementById("myForm").reset();
}
