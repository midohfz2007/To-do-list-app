document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const taskDesc = document.getElementById("task-desc");
    const taskDate = document.getElementById("task-date");
    const taskPrio = document.getElementById("task-priority");
    const addTaskForm = document.getElementById("todo-form");
    const taskList = document.getElementById("task-list");
    const themeBtn = document.getElementById("theme-btn");
    const progressBar = document.getElementById("progress");
    const progressNumbers = document.getElementById("numbers");
    const emptyImage = document.getElementById("empty-image");

    // --- DARK MODE LOGIC ---
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // --- TASK LOGIC ---
    addTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addTask();
    });

    function addTask(text = "", completed = false, desc = "", date = "", priority = "Low") {
        const tName = text || taskInput.value.trim();
        const tDesc = desc || taskDesc.value.trim();
        const tDate = date || taskDate.value;
        const tPrio = priority || taskPrio.value;

        if (tName === "") return;

        const li = document.createElement("li");
        li.className = `prio-${tPrio.toLowerCase()} ${completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
            <div class="task-content">
                <span class="task-title">${tName}</span>
                <small class="task-details">${tDesc ? tDesc + ' | ' : ''} Due: ${tDate || 'N/A'} | <b>${tPrio}</b></small>
            </div>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        // Checkbox toggle
        li.querySelector(".checkbox").addEventListener("change", (e) => {
            li.classList.toggle("completed", e.target.checked);
            updateProgress();
            saveTasks();
        });

        // Delete
        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasks();
        });

        // Advanced Edit
        li.querySelector(".edit-btn").addEventListener("click", () => {
            taskInput.value = tName;
            taskDesc.value = tDesc;
            taskDate.value = tDate;
            taskPrio.value = tPrio;
            li.remove();
            saveTasks();
            updateProgress();
            toggleEmptyState();
        });

        taskList.appendChild(li);
        if (!text) resetInputs(); // Only clear if it's a new user-typed task
        toggleEmptyState();
        updateProgress();
        saveTasks();
    }

    function resetInputs() {
        taskInput.value = "";
        taskDesc.value = "";
        taskDate.value = "";
        taskPrio.value = "Low";
    }

    function toggleEmptyState() {
        emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
    }

    function updateProgress() {
        const total = taskList.children.length;
        const done = taskList.querySelectorAll(".completed").length;
        const percent = total === 0 ? 0 : (done / total) * 100;
        progressBar.style.width = percent + "%";
        progressNumbers.innerText = `${done} / ${total}`;
        if (total > 0 && done === total) triggerConfetti();
    }

    function triggerConfetti() {
    confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 },
        colors: ['#C8102E', '#FFD700', '#ffffff'] // Red, Gold, and White confetti!
    });
}

    function saveTasks() {
        const tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
            text: li.querySelector(".task-title").innerText,
            desc: li.querySelector(".task-details").innerText.split('|')[0].trim(),
            date: li.querySelector(".task-details").innerText.split('|')[1].replace('Due: ', '').trim(),
            priority: li.querySelector("b").innerText,
            completed: li.classList.contains("completed")
        }));
        localStorage.setItem("advancedTasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const saved = JSON.parse(localStorage.getItem("advancedTasks")) || [];
        saved.forEach(t => addTask(t.text, t.completed, t.desc, t.date, t.priority));
    }

    loadTasks();
});