import readline from 'readline';

const tasks = []

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
}

async function validate_input(name, importance) {
    for (let task of tasks) {
        if (task.name.toLowerCase() == name.toLowerCase()) {
            return false
        }
        if (parseInt(importance, 10) > 11) {
            return false
        }
        if (0 > parseInt(importance, 10)) {
            return false
        }
    }
    return true
}

async function create_task(name, importance) {
    let valid = await validate_input(name, importance)
    if (valid == false) {
        console.log("Input not valid. Name each task differently and keep importance from 1 to 10")
        return
    }
    let task = {
        name: name,
        importance: importance,
        completed: false,
    }
    tasks.push(task)
    console.log("Task successfully created: \n", task)
}

function view_mode_display() {
    for (let i = 0; i < tasks.length; i++) {
        console.log(tasks[i]);
    }
}

async function view_mode_search(keyword) {
    console.log("Tasks containing keyword", keyword)
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].name.toLowerCase().includes(keyword)) {
            console.log(tasks[i])
        }
    }
}

function view_mode_order_name() {
    console.log("Tasks in alphabetical order")
    let tasks_sorted = tasks.sort((a, b) => a.name.localeCompare(b.name));
    for (let task of tasks_sorted) {
        console.log(task)
    }
}

function view_mode_order_importance() {
    console.log("Tasks ordered by importance")
    let tasks_sorted = tasks.sort(function(a, b){return Number(b.importance) - Number(a.importance)}).reverse();
    for (let task of tasks_sorted) {
        console.log(task)
    }
}

async function view_tasks() {
    console.log(`Chose a view mode:
        1. Display all tasks
        2. Search by name
        3. Order by name
        4. Order by importance`)
    const view_mode = await ask("> ")
    
    if (view_mode == 1) {
        view_mode_display()
    }
    if (view_mode == 2) {
        const keyword = await ask("Enter keyword: ")
        await view_mode_search(keyword)
    }
    if (view_mode == 3) {
        view_mode_order_name()
    }
    if (view_mode == 4) {
        view_mode_order_importance()
    }
}


async function edit_task(task) {
    let name = await ask("Enter new task name: ")
    let importance = await ask("Enter new task importance")
    let valid = await validate_input(name, importance)
    console.log(valid)
    if (valid == false) {
        console.log("Input not valid. Name each task differently and keep importance from 1 to 10")
        return
    }
}

async function delete_task(task) {
    console.log(task)
    let index = tasks.findIndex(obj => obj === task)

    tasks.splice(index, 1)
    view_mode_display()
}

async function edit_tasks() {
    view_mode_display()
    let task_search = await ask("Enter name of task you wish to edit: ")
    for (let task of tasks) {
        if (task.name.toLowerCase() == task_search.toLowerCase()) {
            console.log("Task: ", task);
            console.log(`Enter preferred action:
            1. Edit task
            2. Delete task
            3. Cancel`)
            const edit_or_delete = await ask("> ")
            if (edit_or_delete == 1) {
                await edit_task(task)
                return
            }
            if (edit_or_delete == 2) {
                await delete_task(task)
                return
            }
        }
    }
    console.log("No matching task found...")
}


async function menu() {
    let i = 1
    console.log(`Chose on of the following actions
        1. Create new task
        2. View Tasks
        3. Edit Tasks
        4. exit`)
    const choice = await ask("> ")
    if (choice == 1) {
        const task_name = await ask("Enter a name for the task: ")
        const task_importance = await ask("Enter importance from 1-10: ")
        create_task(task_name, task_importance)
    }
    if (choice == 2) {
        await view_tasks()
    }
    if (choice == 3) {
        await edit_tasks()
    }
    if (choice === "exit") {
        i = 0
    }
    if (i == 1) {
        menu()
    }
}

function demo_tasks() {
    tasks.push({name: "Do Homework", importance: 5})
    tasks.push({name: "Code in Javascript", importance: 10})
    tasks.push({name: "Walk Dog", importance: 10})
    tasks.push({name: "Prepare Food", importance: 7})
}
/*
run to pre create a few tasks

*/
demo_tasks()

menu()