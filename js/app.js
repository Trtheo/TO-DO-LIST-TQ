document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const taskCategoryInput = document.getElementById("taskCategory");
  const taskNameInput = document.getElementById("taskName");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const errorMessage = document.createElement("p");
  let editMode = false;
  let editIndex = -1;

  errorMessage.style.color = "red";
  errorMessage.style.marginTop = "5px";
  taskForm.appendChild(errorMessage);

  const loadTasks = () => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      taskList.innerHTML = "";

      tasks.forEach((task, index) => {
          const taskItem = document.createElement("li");
          taskItem.className = "task-item";
          taskItem.innerHTML = `
              <div>
                  <strong>Category:</strong> ${task.category}<br>
                  <strong>Task:</strong> ${task.name}<br>
                  <strong>Start Date:</strong> ${task.startDate}<br>
                  <strong>End Date:</strong> ${task.endDate}
              </div>
              <div class="actions">
                  <button class="edit" data-index="${index}">Edit</button>
                  <button class="delete" data-index="${index}">Delete</button>
              </div>
          `;
          taskList.appendChild(taskItem);
      });

      document.querySelectorAll(".delete").forEach(button => {
          button.addEventListener("click", function () {
              const index = this.getAttribute("data-index");
              if (confirm("Are you sure you want to delete this task?")) {
                  deleteTask(index);
              }
          });
      });

      document.querySelectorAll(".edit").forEach(button => {
          button.addEventListener("click", function () {
              editIndex = this.getAttribute("data-index");
              enterEditMode(editIndex);
          });
      });
  };

  const saveTask = (task) => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      if (editMode) {
          tasks[editIndex] = task;
          editMode = false;
          editIndex = -1;
      } else {
          tasks.push(task);
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
      taskForm.reset();
      taskForm.querySelector("button[type='submit']").textContent = "Add Task";
  };

  const deleteTask = (index) => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
  };

  const enterEditMode = (index) => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const task = tasks[index];
      taskCategoryInput.value = task.category;
      taskNameInput.value = task.name;
      startDateInput.value = task.startDate;
      endDateInput.value = task.endDate;
      taskForm.querySelector("button[type='submit']").textContent = "Update Task";
      editMode = true;
  };

  const validateDate = () => {
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (startDate < currentDate) {
          errorMessage.textContent = "Start date cannot be in the past.";
          return false;
      }

      if (endDate < startDate) {
          errorMessage.textContent = "End date cannot be before the start date.";
          return false;
      }

      errorMessage.textContent = "";
      return true;
  };

  taskForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateDate()) {
          const newTask = {
              category: taskCategoryInput.value,
              name: taskNameInput.value,
              startDate: startDateInput.value,
              endDate: endDateInput.value,
          };

          saveTask(newTask);
      }
  });

  loadTasks();
});
