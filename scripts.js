const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

const validateInput = () => inputElement.value.trim().length > 0;

const handleAddTask = () => {
    const inputIsValid = validateInput();

    if (!inputIsValid) {
        return inputElement.classList.add("error");
    }

    updateTaskList(inputElement.value, false);
    
    inputElement.value = "";

    updateLocalStorage();
}

const updateTaskList = (contentValue, isCompleted) => {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskContent = document.createElement("p");
    taskContent.innerText = contentValue;
    if (isCompleted) {
        taskContent.classList.add("completed");
    }
    taskContent.addEventListener("click", () => handleContentClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("far");
    deleteItem.classList.add("fa-trash-alt");

    deleteItem.addEventListener("click", () => handleDeleteClick(taskItemContainer, taskContent));

    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);
}

const handleContentClick = (taskContent) => {
    const tasks = tasksContainer.childNodes;

    for (const task of tasks) {
        const currentTasksIsBeingClicked = task.firstChild.isSameNode(taskContent);
        
        if (currentTasksIsBeingClicked) {
            task.firstChild.classList.toggle("completed");
        }
    }

    updateLocalStorage();
}

const handleDeleteClick = (taskItemContainer, taskContent) => {
    const tasks = tasksContainer.childNodes;

    for (const task of tasks) {
        const currentTasksIsBeingClicked = task.firstChild.isSameNode(taskContent);
        
        if (currentTasksIsBeingClicked) {
            taskItemContainer.remove();
        }
    }

    updateLocalStorage();
}

const handleInputChange = () => {
    const inputIsValid = validateInput();

    if (inputIsValid) {
        return inputElement.classList.remove("error");
    }
}

const updateLocalStorage = () => {
    const tasks = tasksContainer.childNodes;

    const localStorageTasks = [ ... tasks].map(task => {
        const content = task.firstChild;
        const isCompleted = content.classList.contains("completed");

        return { description: content.innerText, isCompleted };
    })

    localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
    
}

const loadTasksFromLocalStorage = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
    if (!tasksFromLocalStorage)
        return;

    for (const task of tasksFromLocalStorage) {
        updateTaskList(task.description, task.isCompleted);
    }
}

loadTasksFromLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());
inputElement.addEventListener("change", () => handleInputChange());
