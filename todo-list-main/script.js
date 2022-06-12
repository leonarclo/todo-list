

// SELETORES
const inputAddTask = document.querySelector('.input-add-task');
const btnAddTask = document.querySelector('.btn-add-task');
const taskList = document.querySelector('.task-list');
const closeModalEdit = document.querySelector('.close-modal-btn');
const modalEdit = document.querySelector('.modal-edit');
const windowModalEdit = document.querySelector('.window-modal-edit');
const btnUptadeTask = document.querySelector('.update-task');
const inputEdit = document.querySelector('#input-edit');
const idTaskEdit = document.querySelector('#id-task-edit');
const clearAllTasks = document.querySelector('.clear-all-tasks');
const titleTasks = document.querySelector('.title-tasks');


let dbTasks = [];

getLocalStorage();
renderTaskList();


btnAddTask.addEventListener('click', (event) => {
  event.preventDefault();
    let task = {
      name: inputAddTask.value,
      id: idGenenator(),
    }
    addTask(task);
})


function idGenenator () {
  return Math.floor(Date.now() * Math.random(36));
}


function addTask (task) {

  dbTasks.push(task)
  saveLocalStorage();
  renderTaskList();
  if (taskList.childElementCount == 1) {
    location.reload();
  }
}


function addDiv (task) {

    const div = document.createElement('div');
    div.classList.add('task-container');
    div.id = task.id;
  
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.classList.add('todo-complete');
    div.appendChild(completeButton);
  
    const li = document.createElement('li');
    li.innerText = task.name;
    li.classList.add('task');
    div.appendChild(li);
  
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.classList.add('todo-edit');
    editButton.setAttribute('onclick', `editTask(${task.id})`);
    div.appendChild(editButton);
  
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.classList.add('todo-trash');
    trashButton.setAttribute('onclick', `deleteTask(${task.id})`);
    div.appendChild(trashButton);

    return div
}

function editTask (id) {

  let div = document.getElementById(`${id}`)
  if (div) {

    idTaskEdit.innerHTML = `${id}`
    inputEdit.value = div.innerText;
    windowEdit();
  } else {
    alert('Elemento HTML não encontrado!')
  }
}



function deleteTask (id) {


    const idTask = getTaskId(id);

      dbTasks.splice(idTask, 1);  
      saveLocalStorage();

    let div = document.getElementById(`${id}`)
    if (div) {
      taskList.removeChild(div);
    } else {
      alert('Elemento HTML não encontrado!')
    }
    if (taskList.childElementCount < 1) {
      location.reload();
    }
  }

clearAllTasks.addEventListener('click', () => {
  let confirm = window.confirm('Tem certeza que deseja excluir todas as tarefas?')
  if (confirm) {
      taskList.innerHTML = [];
      dbTasks = []
      saveLocalStorage();
      location.reload();
  }
})

btnUptadeTask.addEventListener('click', (event) => {
  event.preventDefault();
  
  let idTask = idTaskEdit.innerHTML;

  let newTask = {
    name: inputEdit.value,
    id: idTask,
  }

  let thisTask = document.getElementById(`${idTask}`);

  if (thisTask) {

    const indice = getTaskId(idTask);
    dbTasks[indice] = newTask;

    let div = addDiv(newTask);
    taskList.replaceChild(div, thisTask);
    windowEdit();
  } else {
    alert('Elemento HTML não encontrado!')
  }
})


function windowEdit () {
  modalEdit.classList.toggle('abrir');
  windowModalEdit.classList.toggle('abrir');
}

closeModalEdit.addEventListener('click', () => {
  windowEdit();
})

windowModalEdit.addEventListener('click', () => {
  windowEdit();
})

function renderTaskList () {
  taskList.innerHTML = '';
  for (let i = 0; i < dbTasks.length; i++) {
    let div = addDiv(dbTasks[i]);
    taskList.appendChild(div);
  }
  inputAddTask.value = ''; 
}

function saveLocalStorage () {
  localStorage.setItem('taskList', JSON.stringify(dbTasks));
}

function getLocalStorage() {
  if (localStorage.getItem('taskList')) {
    dbTasks = JSON.parse(localStorage.getItem('taskList'));
  }
}

function getTaskId (id) {
  const idTask = dbTasks.findIndex(task => task.id == id);
  if (idTask < 0) {
    throw new Error('ID da tarefa não encontrado: ', idTask);
  }
  return idTask;
}

function validate () {
  if (taskList.childElementCount < 1) {
    clearAllTasks.classList.add('display-none');
    titleTasks.innerText = 'Não há tarefas'
  } else {
    clearAllTasks.classList.remove('display-none');
  }
}
validate ()