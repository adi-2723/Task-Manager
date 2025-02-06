const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const dueDate = document.getElementById("dueDate");
const categorySelect = document.getElementById("categorySelect");
const taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  taskList.innerHTML = "";
  tasks.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)); // Sort by creation date
  tasks.forEach((task) => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

function createTaskElement(task) {
  const taskItem = document.createElement("li");
  taskItem.classList.toggle("completed", task.completed);

  const taskText = document.createElement("span");
  taskText.textContent = task.text;
  taskItem.appendChild(taskText);

  const completeButton = document.createElement("button");
  completeButton.textContent = "Complete";
  completeButton.classList.add("complete");
  completeButton.onclick = () => toggleTaskCompletion(task);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit");
  editButton.onclick = () => editTask(task);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete");
  deleteButton.onclick = () => deleteTask(task);

  const dueDateSpan = document.createElement("span");
  dueDateSpan.classList.add("due-date");
  dueDateSpan.textContent = `Due: ${task.dueDate}`;

  const creationDateSpan = document.createElement("span");
  creationDateSpan.classList.add("creation-date");
  creationDateSpan.textContent = `Created: ${new Date(
    task.creationDate
  ).toLocaleDateString()}`;

  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  const progress = document.createElement("span");
  const timeLeft = getTimeLeft(task.dueDate);
  const progressPercentage = Math.max(
    0,
    Math.min(100, 100 - timeLeft.days * 4)
  ); // Rough progress calculation
  progress.style.width = `${progressPercentage}%`;
  progressBar.appendChild(progress);

  const categoryLabel = document.createElement("span");
  categoryLabel.classList.add("task-category");
  categoryLabel.textContent = task.category;

  taskItem.appendChild(completeButton);
  taskItem.appendChild(editButton);
  taskItem.appendChild(deleteButton);
  taskItem.appendChild(dueDateSpan);
  taskItem.appendChild(creationDateSpan);
  taskItem.appendChild(progressBar);
  taskItem.appendChild(categoryLabel);

  return taskItem;
}

function getTimeLeft(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const timeDiff = due - now;
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return { days: daysLeft };
}

function addTask() {
  const taskText = taskInput.value.trim();
  const taskPriority = prioritySelect.value;
  const taskDueDate = dueDate.value;
  const taskCategory = categorySelect.value;

  if (taskText === "" || !taskDueDate) {
    alert("Please enter a task and select a due date.");
    return;
  }

  const newTask = {
    text: taskText,
    completed: false,
    priority: taskPriority,
    dueDate: taskDueDate,
    category: taskCategory,
    creationDate: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  loadTasks();

  taskInput.value = "";
  dueDate.value = "";
}

function toggleTaskCompletion(task) {
  task.completed = !task.completed;
  saveTasks();
  loadTasks();
}

function editTask(task) {
  const newText = prompt("Edit task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    loadTasks();
  }
}

function deleteTask(task) {
  tasks = tasks.filter((t) => t !== task);
  saveTasks();
  loadTasks();
}

function filterTasks(status) {
  let filteredTasks;
  if (status === "all") {
    filteredTasks = tasks;
  } else if (status === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (status === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  taskList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

loadTasks();
