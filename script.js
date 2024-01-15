const addRef = document.querySelector('.action-wrapper .add');
const removeRef = document.querySelector('.action-wrapper .remove');
const filterRef = document.querySelector('.action-wrapper .filter');
const modelRef = document.querySelector('.model');
const textAreaRef = document.querySelector('.model .left-portion');
const taskWrapperRef = document.querySelector('.tasks-wrapper');
const rightCategorySelection = document.querySelectorAll('.right-portion .category');
const headerCategoryFilterWrapper = document.querySelector('.category-wrapper');
const taskSearchRef = document.querySelector('.task-search input');

//on clicking "+" , the model box will toggle display
addRef.addEventListener('click',function(e){
    toggleModel();
})

filterRef.addEventListener('click',function(e){
    e.target.parentElement.classList.toggle('enabled');
    headerCategoryFilterWrapper.classList.toggle('enabled');
})

function defaultSelection(){
    removeAllCategorySelection();
    const firstCategory = document.querySelector('.right-portion .category.p1');
    firstCategory.classList.add('selected');
    // console.log(firstCategory);
    
}

function toggleModel(){
    // modelRef.classList.toggle('hide');
    

    const isHidden = modelRef.classList.contains('hide');
    if(isHidden){
        modelRef.classList.remove('hide');
    }else{
        defaultSelection();
        modelRef.classList.add('hide');
    }
}

// Adding the input value in text area to the task object
// All newly created tasks are stored in tasks array (tasks array is used for storage)

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTaskInData(newTask){
    tasks.push(newTask);
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

// We use keydown, because with keyup we get /n

textAreaRef.addEventListener('keydown',function(e){
    if(e.key == "Enter"){
        // console.log(e.target.value);
        const rightSelectedCategory = document.querySelector('.right-portion .category.selected');
        const SelectedCategoryName = rightSelectedCategory.getAttribute('data-category');
        const task = {
            id : Math.floor(Math.random() * 10001),
            title : e.target.value,
            category : SelectedCategoryName
        };
        addTaskInData(task);
        // console.log(tasks);
        e.target.value = "";
        toggleModel();
        createTask(task);
    }
})

function createTask(task){
    const Newtask = document.createElement('div');
    Newtask.className = 'task';
    Newtask.dataset.id = task.id;
    // Newtask.setAttribute('data-id',task.id);
    Newtask.innerHTML = 
    `
        <div class="task-category" data-priority="${task.category}"></div>
        <div class="task-id">ID : ${task.id}
        <div><i class="fa-solid fa-caret-down"></i></div>
        </div>
        <div class="task-title"><textarea>${task.title}</textarea></div>
        <div class="task-delete-icon"><i class="fa-solid fa-trash"></i></div>
    `;
    const lanesRef = document.querySelectorAll('.swim-lane'); 
    const backlogLaneRef = document.querySelector('.tasks-wrapper #backlog .backlog-tile');
    const doingLaneRef = document.querySelector('.tasks-wrapper #doing .doing-tile');
    const doneLaneRef = document.querySelector('.tasks-wrapper #done .done-tile');
    const reviewLaneRef = document.querySelector('.tasks-wrapper #review .review-tile');

    lanesRef.forEach(lane=>{
        if(task.category === 'p1'){
            backlogLaneRef.appendChild(Newtask);
        }else if(task.category === 'p2'){
            doingLaneRef.appendChild(Newtask);
        }else if(task.category === 'p3'){
            doneLaneRef.appendChild(Newtask);
        }else if(task.category === 'p4'){
            reviewLaneRef.appendChild(Newtask);
        }
    })
    const textarearef = Newtask.querySelector('.task-title textarea');
    textarearef.addEventListener('change',function(e){
        const updatedTitle = e.target.value;
        const currentTaskID = task.id;
        updateTitleInData(updatedTitle,currentTaskID);
    });

    const accordianRef = Newtask.querySelector('.task-id div i');
    const taskTitleRef = Newtask.querySelector('.task-title');
    accordianRef.addEventListener('click',function(e){
        e.target.classList.toggle('active');
        taskTitleRef.classList.toggle('active');

    })
}

// console.log(rightCategorySelection);

//          Right section toggle category selection
rightCategorySelection.forEach((category)=>{
    category.addEventListener('click',function(e){
        // console.log(e.target);
        removeAllCategorySelection();
        e.target.classList.add('selected');
    })
});

function removeAllCategorySelection(){
rightCategorySelection.forEach((category)=>{
    category.classList.remove('selected');
});
}

function updateTitleInData(updatedTitle,taskid){
    const selectedTaskIDX = tasks.findIndex(task => Number(task.id) === Number(taskid));
    const selectedTask = tasks[selectedTaskIDX];
    selectedTask.title = updatedTitle;
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function deleteTaskFromData(taskID){
    const selectedTaskIDX = tasks.findIndex((task) => Number(task.id) === Number(taskID));
    tasks.splice(selectedTaskIDX,1);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    // console.log(tasks);
}

taskWrapperRef.addEventListener('click',function(e){
    // console.log(e.target);
    if(e.target.classList.contains('fa-trash')){
        const currentTaskID = e.target.closest('.task');
        const task_id = currentTaskID.getAttribute('data-id');
        // console.log(task_id);
        currentTaskID.remove();
        deleteTaskFromData(task_id);
    }

    if(e.target.classList.contains('task-category')){
        const currentPriority = e.target.dataset.priority;
        const nextPriority = getNextPriority(currentPriority);
        e.target.dataset.priority = nextPriority;
        const taskElement = e.target.closest('.task');
        const taskid = taskElement.dataset.id;
        updatePriorityInData(taskid,nextPriority);

        // We can also use the closest function, i.e 
        // updatePriorityInData(e.target.closest('.task').dataset.id);
    }
})

// Function to move tasks to resp swim-lane after the priority is changed


// Function to save the priority color in localStorage & tasks array
function updatePriorityInData(taskid,nextPriority){
    // Remember to set use Number() before task ID
    const taskIndex = tasks.findIndex(task => Number(task.id) === Number(taskid));
    tasks[taskIndex].category = nextPriority;
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

//Function to change task priority color 

function getNextPriority(currentPriority){
    const priorityList = ['p1','p2','p3','p4'];
    const currentPriorityIDX = priorityList.findIndex((index) => index === currentPriority);
    const nextPriorityIDX = (currentPriorityIDX + 1)%4;

    return priorityList[nextPriorityIDX];
}

//      Function to filter as per different color
headerCategoryFilterWrapper.addEventListener('click',function(e){

    if(e.target.classList.contains('category')){
        const selectedPriority = e.target.dataset.priority;
        // console.log(selectedPriority);
        const taskListRef = document.querySelectorAll('.task');
        taskListRef.forEach( taskRef =>{
            taskRef.classList.remove('hide');
            const currentTaskPriority = taskRef.querySelector('.task-category').dataset.priority;
            if(currentTaskPriority !== selectedPriority){
                taskRef.classList.add('hide');
            }
        })
    }
})

// Functionality to remove task filter
headerCategoryFilterWrapper.addEventListener('dblclick',function(e){
    if(e.target.classList.contains('category')){
        const taskListRef = document.querySelectorAll('.task');
        taskListRef.forEach(task=>{
            if(task.classList.contains('hide')){
                task.classList.remove('hide');
            }
        })
    }
})

removeRef.addEventListener('click',function(e){
    const isDeleteEnabled = e.target.parentElement.classList.contains('enabled');
    if(isDeleteEnabled){
        e.target.parentElement.classList.remove('enabled');
        taskWrapperRef.dataset.deleteEnabled = "false";
        // toggleDeleteIcon(false);
    }else{
        e.target.parentElement.classList.add('enabled');
        taskWrapperRef.dataset.deleteEnabled = "true";
        // toggleDeleteIcon(true);
    }

})

// function toggleDeleteIcon(visible){
//     const allDeleteRef = document.querySelectorAll('.task-delete-icon');
//     allDeleteRef.forEach((icon)=>{
//         icon.style.display = visible ? "block" : "none";
//     })
// }

// We have added edit functionality using CSS pointer-events property

// Edit feature using eventListener

// editRef.addEventListener('click',function(e){
//     e.target.parentElement.classList.toggle('enabled');
//     const textAreaRef = document.querySelectorAll('#myTextArea');
//     textAreaRef.forEach(task=>{
//         console.log(task.readOnly);
//         if(task.readOnly){
//             task.readOnly = false;
//         }else{
//             task.readOnly = true;
//         }
//         // if(isEditable){
//         //     e.target.parentElement.classList.remove('enabled');
//         //     textAreaRef.readOnly = false;
//         // }else{
//         //     e.target.parentElement.classList.add('enabled');
//         //     textAreaRef.readOnly = true;
//         // }
//     })  
//     localStorage.setItem('tasks',JSON.stringify(tasks)); 
// })

taskSearchRef.addEventListener('keyup',function(e){
    console.log(e.target.value);
    const swimlanesRef = taskWrapperRef.querySelectorAll('.swim-lane div');
    swimlanesRef.forEach(lane =>{
        lane.innerHTML = "";
    })

    // taskWrapperRef.innerHTML = "";
    // In memory data
    tasks.forEach(task =>{
        const currentTitle = task.title.toLowerCase();
        const searchText = e.target.value.toLowerCase();
        const taskID = String(task.id);

        if(searchText.trim() === "" 
        || currentTitle.includes(searchText) 
        || taskID.includes(searchText)){
            createTask(task);
        }
    })

    //  DOM reference - TODO


})

//Logic to render list at the time of load itself
function renderTaskList(){
    tasks.forEach(task=> {
        createTask(task);
    })
}

renderTaskList();
