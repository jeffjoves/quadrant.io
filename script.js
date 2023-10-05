document.addEventListener("DOMContentLoaded", function () {
    const taskContainers = [
        document.getElementById("taskContainer1"),
        document.getElementById("taskContainer2"),
        document.getElementById("taskContainer3"),
        document.getElementById("taskContainer4")
    ];

    function openButton(containerIndex) {
        const inputContainer = taskContainers[containerIndex - 1].querySelector(".inputContainer");
        const addButton = taskContainers[containerIndex - 1].querySelector(".openButton");

        inputContainer.style.display = "block";
        addButton.style.display = "none";
    }

    function addTask(containerIndex) {
        const taskContainer = taskContainers[containerIndex - 1];
        const taskInput = taskContainer.querySelector(".taskInput");
        const taskList = taskContainer.querySelector(".taskList");
        const taskText = taskInput.value.trim();

        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        const taskItems = taskList.querySelectorAll("li");

        // optional if you want to limit the task
        // if (taskItems.length >= 7) {
        //     alert("You have reached the maximum of 7 tasks. Please complete or delete some tasks.");
        //     return;
        // }

        const listItem = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", function () {
            updateTaskStyle(listItem, checkbox, containerIndex);
            saveTasks(containerIndex);
        });

        listItem.appendChild(checkbox);

        const taskTextSpan = document.createElement("span");
        taskTextSpan.textContent = taskText;
        listItem.appendChild(taskTextSpan);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            listItem.remove();
            saveTasks(containerIndex);
        });

        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
        taskInput.value = ""; // Clear the input
        taskInput.placeholder = "Type Something..."; // Update the placeholder

        saveTasks(containerIndex);
    }

    function updateTaskStyle(listItem, checkbox, containerIndex) {
        const taskTextSpan = listItem.querySelector("span");
        taskTextSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
        saveTasks(containerIndex);
    }

    function saveTasks(containerIndex) {
        const taskContainer = taskContainers[containerIndex - 1];
        const taskItems = taskContainer.querySelectorAll(".taskList li");

        const tasks = Array.from(taskItems).map(taskItem => ({
            text: taskItem.querySelector("span").textContent,
            checked: taskItem.querySelector("input[type='checkbox']").checked
        }));

        localStorage.setItem(`tasks_${containerIndex}`, JSON.stringify(tasks));
    }

    function loadTasks(containerIndex) {
        const taskContainer = taskContainers[containerIndex - 1];
        const tasks = JSON.parse(localStorage.getItem(`tasks_${containerIndex}`)) || [];

        for (const task of tasks) {
            const listItem = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.checked;
            checkbox.addEventListener("change", function () {
                updateTaskStyle(listItem, checkbox, containerIndex);
                saveTasks(containerIndex);
            });

            listItem.appendChild(checkbox);

            const taskTextSpan = document.createElement("span");
            taskTextSpan.textContent = task.text;
            if (task.checked) {
                taskTextSpan.style.textDecoration = "line-through";
            }
            listItem.appendChild(taskTextSpan);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";  //Making the Delete Button Exist
            deleteButton.classList.add("delete-button"); // Assign the CSS class

            deleteButton.addEventListener("click", function () {
                listItem.remove();
                saveTasks(containerIndex);
            });

            listItem.appendChild(deleteButton);

            taskContainer.querySelector(".taskList").appendChild(listItem);
        }
    }

    // Attach click event listeners to open buttons
    for (let i = 1; i <= taskContainers.length; i++) {
        taskContainers[i - 1].querySelector(".openButton").addEventListener("click", function () {
            openButton(i);
        });

        // Add event listener to the "Save" button
        taskContainers[i - 1].querySelector(".addTaskButton").addEventListener("click", function () {
            addTask(i);
        });

        // Add event listener for the Enter key press on mobile devices
        taskContainers[i - 1].querySelector(".taskInput").addEventListener("keyup", function (event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                event.preventDefault(); // Prevent the default form submission behavior
                addTask(i); // Call the addTask function when Enter is pressed
                location.reload();
            }
        });
    }

    // Load saved tasks for all containers
    for (let i = 1; i <= taskContainers.length; i++) {
        loadTasks(i);
    }
});

function reloadPage() {
    location.reload();
}
