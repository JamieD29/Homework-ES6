import Todo from './models/Todo.js';

// let todo1 = new Todo(1, "Test1", false);

// console.log(todo1);

let todoList = [];

let completedList = [];

window.onload = () => {
    todoList = mapTodoList(JSON.parse(localStorage.getItem('todos')));
    completedList = mapTodoList(JSON.parse(localStorage.getItem('completedTodo')));
    renderTodoList(todoListEl, todoList);
    renderTodoList(completedListEl, completedList);
}

const todoListEl = document.getElementById('todo');

const completedListEl = document.getElementById('completed');

const inputTodo = document.querySelector('#newTask');

inputTodo.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTodo();
        inputTodo.value = "";
        localStorage.setItem('todos', JSON.stringify(todoList));
    }
});

let addBtn = document.querySelector('#addItem').addEventListener("click", () => {
    addTodo();
    inputTodo.value = "";
    localStorage.setItem('todos', JSON.stringify(todoList));

})

function mapTodoList(local) {
    let result = new Array();
    for (let i = 0; i < local.length; i++) {
        let oldTodo = local[i];
        let copyTodo = new Todo(
            oldTodo.id,
            oldTodo.value
        );

        result.push(copyTodo);
    }

    return result;
}

function addTodo() {

    const inputValue = inputTodo.value;

    let id = Math.floor(Math.random() * 1000);

    for (let i = 0; i < todoList.length; i++) {
        if (id === todoList[i].id) {
            id = Math.floor(Math.random() * 1000);
        }
    }


    //Check if the todo is empty
    const isEmpty = inputValue === '';

    //Check for duplicate todo 
    const isDuplicate =
        todoList.some((todo) => todo.value === inputValue);

    if (isEmpty) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Todo's input is empty",
        })
    } else if (isDuplicate) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Todo has already added",
        })
    }
    else {
        let task = new Todo(id, inputValue);
        todoList.push(task);
        renderTodoList(todoListEl, todoList);
    }
}

function renderTodoList(interfaceList, list) {
    let html = "";

    for (let task of list) {
        html += `
        <li class="todoEl">
            ${task.value}
         <div class="buttons">
             <button class="" onclick="completeTask(${task.id})">
             <i class="fas fa-check-circle complete" ></i>
             </button>  
             <button class="" onclick="deleteTodo(${task.id})">
             <i class="fas fa-trash remove" ></i>
             </button>
         </div> 
         </li>
        `;
    }

    interfaceList.innerHTML = html;
}

window.completeTask = (id) => {
    const list = todoList;
    let index = list.findIndex((obj) => obj.id === id);

    if (index === -1) return;

    completedList.push(list[index]);
    list.splice(index, 1);

    localStorage.setItem('todos', JSON.stringify(list));
    renderTodoList(todoListEl, list);

    localStorage.setItem('completedTodo', JSON.stringify(completedList));
    renderTodoList(completedListEl, completedList);

}

window.deleteTodo = (id) => {
    const list = todoList;
    let index = list.findIndex((obj) => obj.id === id);

    if (index === -1) {
        index = completedList.findIndex((obj) => obj.id === id);
        completedList.splice(index, 1);
        localStorage.setItem('completedTodo', JSON.stringify(completedList));
        renderTodoList(completedListEl, completedList);
        return;
    }

    list.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(list));
    renderTodoList(todoListEl, list);

}

window.orderBy = (key, tag) => { //name
    let order = tag.getAttribute('data-order');

    let arrayResult = _.orderBy(todoList, [key], [order]);
    renderTodoList(todoListEl, arrayResult);

    let arrayCompletedResult = _.orderBy(completedList, [key], []);
    renderTodoList(completedListEl, arrayCompletedResult);
}
