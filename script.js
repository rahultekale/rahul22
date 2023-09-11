
const tasks = [
    { id: 1, title: 'Task 1', description: 'Description for Task 1', status: 'todo' },
    { id: 2, title: 'Task 2', description: 'Description for Task 2', status: 'doing' },
    { id: 3, title: 'Task 3', description: 'Description for Task 3', status: 'done' }
  ];
  
  const taskLists = {
    todo: document.getElementById('task-list-todo'),
    doing: document.getElementById('task-list-doing'),
    done: document.getElementById('task-list-done')
  };
  
  function createTaskCard(task) {
    const card = document.createElement('div');
    card.classList.add('task-card');
    card.dataset.id = task.id;
    card.draggable = true;
    card.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
    `;
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    return card;
  }
  
  function renderTasks() {
    for (const status in taskLists) {
      const taskList = taskLists[status];
      taskList.innerHTML = '';
      tasks.filter(task => task.status === status).forEach(task => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
      });
    }
  }
  
  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
  }
  
  function handleDragOver(event) {
    event.preventDefault();
  }
  
  function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const status = event.currentTarget.parentElement.id;
    
    // Update the task's status
    const task = tasks.find(task => task.id === parseInt(taskId));
    if (task) {
      task.status = status;
      renderTasks();
    }
  }
  
  renderTasks();
  // Function to save tasks to localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// Function to update the task count and display it
function updateTaskCount() {
  for (const status in taskLists) {
    const taskList = taskLists[status];
    const taskCount = tasks.filter(task => task.status === status).length;
    taskList.previousElementSibling.innerHTML = `${status} (${taskCount} tasks)`;
  }
}

// Function to add a new task
function addTask(title, description, status) {
  const newTask = {
    id: tasks.length + 1,
    title: title,
    description: description,
    status: status,
  };
  tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to handle the form submission
function handleSubmit(event) {
  event.preventDefault();
  const titleInput = document.getElementById('titleInput');
  const descriptionInput = document.getElementById('descriptionInput');
  const statusSelect = document.getElementById('statusSelect');

  const title = titleInput.value;
  const description = descriptionInput.value;
  const status = statusSelect.value;

  if (title && description && status) {
    addTask(title, description, status);

    // Clear form inputs
    titleInput.value = '';
    descriptionInput.value = '';
    statusSelect.value = 'todo';
  }
}

// Event listener for form submission
const form = document.getElementById('taskForm');
form.addEventListener('submit', handleSubmit);

// Load tasks from localStorage on page load
loadTasksFromLocalStorage();

// Initial rendering and task count update
renderTasks();
updateTaskCount();
