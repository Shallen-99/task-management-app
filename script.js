let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkOverdueTasks() {
  const today = new Date().toISOString().split('T')[0];
  tasks.forEach(task => {
    if (task.status !== 'Completed' && task.deadline < today) {
      task.status = 'Overdue';
    }
  });
}

function addTask(e) {
  e.preventDefault();

  const taskName = document.getElementById('taskName').value.trim();
  const category = document.getElementById('category').value.trim();
  const deadline = document.getElementById('deadline').value;
  const status = document.getElementById('status').value;

  if (!taskName || !category || !deadline) {
    alert('Please fill in all fields.');
    return;
  }

  const newTask = { taskName, category, deadline, status };
  tasks.push(newTask);
  saveTasks();
  updateCategoryFilterOptions();
  displayTasks();
  taskForm.reset();
}

function displayTasks() {
  checkOverdueTasks();
  taskList.innerHTML = '';

  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  const filteredTasks = tasks.filter(task => {
    const categoryMatch = selectedCategory === 'All' || task.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || task.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  filteredTasks.forEach((task, index) => {
    const row = document.createElement('tr');
    row.classList.toggle('overdue', task.status === 'Overdue');
    row.classList.toggle('completed', task.status === 'Completed');

    const select = document.createElement('select');
    ['In Progress', 'Completed'].forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      if (task.status === status) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('change', e => {
      updateTaskStatus(index, e.target.value);
    });

    row.innerHTML = `
      <td>${task.taskName}</td>
      <td>${task.category}</td>
      <td>${task.deadline}</td>
      <td>${task.status}</td>
      <td></td>
    `;

    row.lastElementChild.appendChild(select);

    taskList.appendChild(row);
  });

  saveTasks();
}

function updateTaskStatus(index, newStatus) {
  tasks[index].status = newStatus;
  saveTasks();
  displayTasks();
}

function updateCategoryFilterOptions() {
  const categories = ['All', ...new Set(tasks.map(task => task.category))];
  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');
}

taskForm.addEventListener('submit', addTask);
categoryFilter.addEventListener('change', displayTasks);
statusFilter.addEventListener('change', displayTasks);

updateCategoryFilterOptions();
displayTasks();