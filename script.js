// let tasks = JSON.parse(localStorage.getItem("tasks")) || []

const taskForm = document.getElementById("taskForm")
const taskList = document.getElementById("taskList")
const categoryFilter = document.getElementById("categoryFilter")
const statusFilter = document.getElementById("statusFilter")

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}
let tasks = JSON.parse(localStorage.getItem("tasks")) || []
function overdueTasks() {
    const today = new Date().toISOString().split("T")[0]
    tasks.forEach(task => {
        if (task.status !== "Completed" && task.deadline < today) {
            task.status = "Overdue"
        }
    })
}

function addTask(e) {
    e.preventDefault()
    const taskName = document.getElementById("taskName").value.trim()
    const category = document.getElementById("category").value.trim()
    const deadline = document.getElementById("deadline").value
    const status = document.getElementById("status").value

    if (!taskName || !category || !deadline) {
        alert("Please fill in all fields")
        return
    }

    const newTask = { taskName, category, deadline, status }
    tasks.push(newTask)
    saveTasks()
    updateCategoryFilter()
    displayTasks()
    taskForm.reset()
}

function displayTasks() {
    overdueTasks()
    // taskList.innerHTML = ""

    const selCat = categoryFilter.value
    const selStatus = statusFilter.value

    const filteredTasks = tasks.filter(task => {
        const categoryMatch = selCat === "All" || task.category === selCat
        const statusMatch = selStatus === "All" || task.status === selStatus
        return categoryMatch && statusMatch
    })

    filteredTasks.forEach((task, index) => {
        const row = document.createElement("tr")
        row.classList.toggle("overdue", task.status === "Overdue")
        row.classList.toggle("completed", task.status === "Completed")
        console.log(task)
        const tdName = document.createElement("td")
        tdName.textContent = task.taskName

        const tdCategory = document.createElement("td")
        tdCategory.textContent = task.category

        const tdDeadline = document.createElement("td")
        tdDeadline.textContent = task.deadline

        const tdStatus = document.createElement("td")
        tdStatus.textContent = task.status

        const tdSelect = document.createElement("td")
        const select = document.createElement("select")
        ["In Progress", "Completed"].forEach(statusOption => {
            const option = document.createElement("option")
            option.value = statusOption
            option.textContent = statusOption
            if (task.status === statusOption) option.selected = true
            select.appendChild(option)
        })

        select.addEventListener("change", e => {
            updateTaskStatus(index, e.target.value)
        })

        tdSelect.appendChild(select)
        row.appendChild(tdName, tdCategory, tdDeadline, tdStatus, tdSelect)
        taskList.appendChild(row)
    })

    saveTasks()
}

function updateTaskStatus(index, newStatus) {
    tasks[index].status = newStatus
    saveTasks()
    displayTasks()
}

function updateCategoryFilter() {
    const categories = ["All", ...new Set(tasks.map(task => task.category))]
    categoryFilter.innerHTML = categories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("")
}

taskForm.addEventListener("submit", addTask)
categoryFilter.addEventListener("change", displayTasks)
statusFilter.addEventListener("change", displayTasks)

updateCategoryFilter()
displayTasks()
