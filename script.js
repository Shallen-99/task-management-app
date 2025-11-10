let tasks = JSON.parse(localStorage.getItem("tasks")) || []

const taskForm = document.getElementById("taskForm")
const taskList = document.getElementById("taskList")
const categoryFilter = document.getElementById("categoryFilter")
const statusFilter = document.getElementById("statusFilter")

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function overdueTasks () {
    const today = new Date().toISOString().split("T")[0]
    tasks.forEach(task => {
        if (task.status !== "completed" && task.deadline < today) {
            task.status = "overdue"
        }
    })
}

function add(task) {
    task.preventDefault()
    const taskName = document.getElementById("taskName").value.trim()
    const category = document.getElementById("category").value.trim()
    const deadline = document.getElementById("deadline").value.trim()
    const status = document.getElementById("status").value

    if (!taskName || !category || !deadline) {
        alert("Please Fill In ALl The Fields")
    }

    const newTask = {taskName, category, deadline, status}
    task.push(newTask)
    saveTasks()
    updateCategory()
    displayTasks()
    taskForm.reset()
}

function displayTasks() {
    overdueTasks()
    taskList.innerHTML
    const selCat = categoryFilter.value
    const selSat = statusFilter.value

    const filteredTasks = tasks.filter(task => {
        const 
    })
}