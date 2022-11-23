const classNames = {
    TODO_ITEM: "todo-container",
    TODO_CHECKBOX: "todo-checkbox",
    TODO_TEXT: "todo-text",
    TODO_DELETE: "todo-delete",
}

const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");
let todos = [];

function newTodo() {
    let text = prompt("Enter new task to do", "Do something");
    const todo = {
        text, checked: false, id: Date.now(),
    };
    todos.push(todo);
    renderTodo(todo);
    updateCounters();
}

function renderTodo(t) {
    if (t?.toDelete) {
        const li = document.getElementById(`${t.id}`);
        li.remove();
    } else {
        const li = document.createElement("li");
        li.setAttribute("id", `${t.id}`);
        li.setAttribute("class", `${classNames.TODO_ITEM}`)
        li.innerHTML = `<input onClick="toggleCheckbox(${t.id})" class="${classNames.TODO_CHECKBOX}" type="checkbox" ${t.checked ? "checked" : ""}>
                    <label class="${classNames.TODO_TEXT}"><span>${t?.text}</span></label>
                    <button class="${classNames.TODO_DELETE}" onClick="deleteTodo(${t.id})">delete</button>`;
        list.appendChild(li);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    updateCounters();
}

function toggleCheckbox(key) {
    todos = todos.map(t => {
        if (t.id !== key) return t
        return { ...t, checked: !t.checked }
    });
    updateCounters();
    localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteTodo(key) {
    const index = todos.findIndex(t => t.id === Number(key));
    if (index >= 0) {
        const todo = {
            toDelete: true, id: key,
            ...todos[index]
        };
        todos = todos.filter(t => t.id !== Number(key));
        renderTodo(todo);
    }
}

function updateCounters() {
    itemCountSpan.textContent = todos.length.toString();
    uncheckedCountSpan.textContent = todos.filter((t) => t.checked === false).length.toString();
}

document.addEventListener('DOMContentLoaded', () => {
    const localTodos = localStorage.getItem('todos');
    if (localTodos) {
        todos = JSON.parse(localTodos);
        todos.forEach(t => {
            renderTodo(t);
        });
        updateCounters();
    }
});