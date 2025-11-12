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
        alert("Please Fill In All The Fields")
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
        const mCategory = selCat === "All" || task.category === selCat
        const mStatus = selSat === "All" || task.status === selSat
        return mCategory && mStatus
    })

    filteredTasks.forEach((task, index) => {
        const row = document.createElement("tr")
        row.classList.toggle("overdue", task.status === "Overdue")
        row.classList.toggle("completed", task.status === "Completed")

        const select = document.createElement("select")
        ["inProgress", "completed"].forEach(status => {
            const option = document.creatElement("option")
            option.value = status
            option.textContent = status
            if (task.status === status) option.selected = true
            select.appendChild(option)
        })

        select.addEventListener("change", e => {
            updateTaskStatus(index, e.target.value)
        })

        row.innerHTML = ` <td>${task.taskName}</td>
        <td>${task.category}</td>
        <td>${task.deadline}</td>
        <td>${task.status}</td>
        <td></td>`

        row.lastElementChild.appendChild(select)
        taskList.appendChild(row)
    })
    saveTasks()
}

function updateTaskStatus(index, newStatus) {
   tasks[index].status = newStatus
   saveTasks()
   displayTasks() 
}

function updateCategoryFilter(){
    const categories = ["All", ...new Set(tasks.map(task => task.category))]
    categoryFilter.innerHTML = categories
    .map(cat => `<option value = "${cat}">${cat}</option>`)
    .join("")
}

taskForm.addEventListener("submit", add)
categoryFilter.addEventListener("change", displayTasks)
statusFilter.addEventListener("change", displayTasks)

updateCategoryFilter()
displayTasks()