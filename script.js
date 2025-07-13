

        document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('taskInput');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const taskList = document.getElementById('taskList');
            const emptyState = document.getElementById('emptyState');
            const totalTasksElement = document.getElementById('totalTasks');
            const completedTasksElement = document.getElementById('completedTasks');
            
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Update stats display
            function updateStats() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                
                totalTasksElement.textContent = totalTasks;
                completedTasksElement.textContent = completedTasks;
                
                // Show/hide empty state
                emptyState.style.display = totalTasks === 0 ? 'block' : 'none';
            }
            
            // Save tasks to localStorage
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
                updateStats();
            }
            
            // Create task element
            function createTaskElement(task, index) {
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item';
                if (task.completed) {
                    taskItem.classList.add('completed');
                }
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn">×</button>
                `;
                
                // Toggle completed status
                const checkbox = taskItem.querySelector('.task-check');
                checkbox.addEventListener('change', function() {
                    tasks[index].completed = this.checked;
                    taskItem.classList.toggle('completed', this.checked);
                    saveTasks();
                });
                
                // Delete task
                const deleteBtn = taskItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', function() {
                    tasks.splice(index, 1);
                    taskItem.remove();
                    saveTasks();
                });
                
                return taskItem;
            }
            
            // Render tasks
            function renderTasks() {
                taskList.innerHTML = '';
                
                tasks.forEach((task, index) => {
                    const taskElement = createTaskElement(task, index);
                    taskList.appendChild(taskElement);
                });
                
                updateStats();
            }
            
            // Add new task
            function addTask() {
                const text = taskInput.value.trim();
                
                if (text) {
                    const newTask = {
                        text: text,
                        completed: false,
                        createdAt: new Date()
                    };
                    
                    tasks.push(newTask);
                    saveTasks();
                    
                    const taskElement = createTaskElement(newTask, tasks.length - 1);
                    taskList.appendChild(taskElement);
                    
                    taskInput.value = '';
                    taskInput.focus();
                }
            }
            
            // Event listeners
            addTaskBtn.addEventListener('click', addTask);
            
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            
            // Initialize the app
            renderTasks();
        });
    