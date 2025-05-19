import {TaskItem} from "./Model/TaskItem";
import {PostTaskItem} from "./Model/PostTaskItem"
import {TaskService} from "./service/task-service";
import trashBinImg from "./icons/trash-bin.svg"
import {h} from "preact";
import {SubTaskService} from "./service/subtask-service";

const EditTaskPopup = ({onPut}) => {
    let taskService = new TaskService();
    const putTask = async () => {
        let repeat = false;
        if (+(document.getElementById("editPriority") as HTMLInputElement).value > 0) {
            repeat = true;
        }
        const TaskItem: PostTaskItem = {
            status: (document.getElementById("editStatus") as HTMLInputElement).value,
            title: (document.getElementById("editTitle") as HTMLHeadElement).innerText,
            description: (document.getElementById("editDescription") as HTMLInputElement).value,
            deadline: (document.getElementById("editDeadline") as HTMLInputElement).value,
            importance: +(document.getElementById("editPriority") as HTMLInputElement).value,
            repeat: repeat,
            interval: +(document.getElementById("editPriority") as HTMLInputElement).value,
            assignment: getAssigneeFromEditForm()[1]
        };

        const body = JSON.stringify(TaskItem);
        const subStrings = getTaskIdFromEditForm();
        let result = await taskService.PutTaskItem(subStrings[1], body);
        console.log(result);
        hideEditTaskFormHtml();
        onPut();
    }
    const deleteTask = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            const subStrings = getTaskIdFromEditForm();
            let result = await taskService.DeleteTaskItem(subStrings[1]);
            console.log(result);
            hideEditTaskFormHtml();
            onPut();
        }
    }

    return (
        <form id="editTaskForm" class="editTaskForm visibleDisplay" style="display:none" onSubmit={putTask}>
            <div>
                <div id="editTaskFormHeader" class="editTaskFormHeader">
                    <label id="editTaskId">Task Id</label>
                    <label id="editAssign">Assigned for</label>
                    <div class="topRightEdit">
                        <button id="addSubTaskBtn">Add Sub-Task</button>
                        <img src={trashBinImg} id="deleteTask" alt="Delete" width="35" height="35"
                             onClick={deleteTask}></img>
                    </div>
                </div>

                <h3 id="editTitle" contenteditable="true">Task Title</h3>
            </div>
            <div class="taskFormBody">
                <label for="editDescription">Description</label>
                <textarea class="editText" id="editDescription" rows={10} placeholder="Description" required></textarea>
                <br></br>
                <div class="editInputLine">
                    <div>
                        <label for="editDeadline">Deadline</label>
                        <input type="datetime-local" class="editText" id="editDeadline" required></input>
                    </div>
                    <div>
                        <label class="editLabel" for="editPriority">Priority:</label>
                        <select class="addInput" id="editPriority" required>
                            <option value="1">low</option>
                            <option value="2">medium</option>
                            <option value="3">high</option>
                        </select>
                    </div>
                    <div>
                        <label class="editLabel" for="editStatus">Status:</label>
                        <select class="addInput" id="editStatus" required>
                            <option value="ToDo">To Do</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                    <div>
                        <label class="editLabel" for="editRepeat">Repeating task?</label>
                        <input class="addInput" type="checkbox" onChange={showEditRepeat} id="editRepeat"
                               name="email"></input>
                    </div>
                    <div id="editRepeating" style="visibility: hidden;">
                        <label class="editLabel" for="editInterval">Repeating in</label>
                        <input class="addInput" type="number" id="editInterval" placeholder="0">
                            <label for="editInterval">Days!</label></input>
                    </div>
                </div>
                <h4 style="text-align: center">Sub-Tasks</h4>
                <div id="subtasks" style="display: flex; flex-direction: column">
                    <table id="subtaskTable" class="Task-Table">
                        <tbody>
                        </tbody>
                    </table>
                    <br></br>
                </div>



            </div>
            <div class="confirmations">
                <button class="submitButton" type="submit">Confirm Changes</button>
                <button class="closeButton" type="button" onClick={hideEditTaskFormHtml}>Close</button>
            </div>
        </form>
    );
};


function hideEditTaskFormHtml() {
    document.getElementById("editTaskForm")!.style.display = "none";
    document.getElementById('column-grid')!.classList.remove('disabled');
    (document.getElementById('addButton')! as HTMLButtonElement).disabled = false;
}

export function showEditTaskFormHtml(taskItem: TaskItem) {
    document.getElementById("editTaskForm")!.style.display = "flex";
    document.getElementById('column-grid')!.classList.add('disabled');
    (document.getElementById('addButton')! as HTMLButtonElement).disabled = true;
    const originalTaskItem = taskItem;
    document.getElementById("editTaskId")!.textContent = "Task ID: " + originalTaskItem.task_id
    document.getElementById("editAssign")!.textContent = "Assignee: " + originalTaskItem.assignment
    document.getElementById("editTitle")!.textContent = originalTaskItem.title;
    document.getElementById("editDescription")!.textContent = originalTaskItem.description;
    (document.getElementById("editStatus") as HTMLSelectElement)!.value = originalTaskItem.status;
    (document.getElementById("editDeadline") as HTMLInputElement)!.value = originalTaskItem.deadline;
    (document.getElementById("editPriority") as HTMLSelectElement)!.value = originalTaskItem.importance;
    // (document.getElementById('addSubTaskBtn')! as HTMLButtonElement).onclick = () =>
    //     this.SubAddPopup.showAddSubTaskFormHtml(originalTaskItem.task_id);
    createSubTaskTable(originalTaskItem)
}

function createSubTaskTable(taskItem: TaskItem) {
    const tableBody = document.getElementById("subtaskTable")?.getElementsByTagName('tbody')[0];
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    if (taskItem.subTasks == null) {
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        titleCell.innerText = "No Subtasks yet";
        row.appendChild(titleCell);
        if (tableBody) {
            tableBody.appendChild(row);
        }
    } else {
        taskItem.subTasks.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
        taskItem.subTasks.forEach(subTask => {
            //const subEditPopup = new SubEditPopup(subTask);

            const row = document.createElement('tr');
            const titleCell = document.createElement('td');
            const deadlineCell = document.createElement('td');
            const importanceCell = document.createElement('td');
            const statusCell = document.createElement('td');
            const editCell = document.createElement('td');

            const impImg = document.createElement('img');
            const editImg = document.createElement('img');
            const selectElement = document.createElement('select');
            selectElement.className = 'subTaskStatusBox';
            const statuses = ["ToDo", "InProgress", "Done"];
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                selectElement.appendChild(option);
            });
            selectElement.value = subTask.status;

            const impNr = +subTask.importance;
            switch (impNr) {
                case 1:
                    impImg.src = "./src/icons/low-priority.svg";
                    break;
                case 2:
                    impImg.src = "./src/icons/medium-priority.svg";
                    break;
                case 3:
                    impImg.src = "./src/icons/high-priority.svg";
                    break;
                default:
                    impImg.alt = 'Err';
            }
            const updateStatusStyles = () => {
                switch (selectElement.value) {
                    case "ToDo":
                        selectElement.style.color = 'lightgrey';
                        selectElement.style.borderColor = 'lightgrey';
                        subTask.status = "ToDo";
                        break;
                    case "InProgress":
                        selectElement.style.color = 'aquamarine';
                        selectElement.style.borderColor = 'aquamarine';
                        subTask.status = "InProgress";
                        break;
                    case "Done":
                        selectElement.style.color = 'green';
                        selectElement.style.borderColor = 'green';
                        subTask.status = "Done";
                        break;
                }
            };

            const patchStatus = async () => {
                const subTaskService = new SubTaskService();
                const Status: { status: string } = {status: selectElement.value}
                const body = JSON.stringify(Status);
                const result = await subTaskService.PatchSubTaskItem(subTask.taskId, body);
                console.log(result);
            }

            updateStatusStyles();
            selectElement.addEventListener('change', () => {
                updateStatusStyles();
                patchStatus();
            });

            statusCell.appendChild(selectElement);
            impImg.className = 'tableImg';
            importanceCell.appendChild(impImg);
            editImg.className = 'tableImg';
            editImg.style.cursor = 'pointer';
            editImg.src = "./src/icons/edit.svg";
            //editImg.onclick = function clickEdit() {subEditPopup.showEditSubTaskFormHtml()}
            editCell.appendChild(editImg);


            titleCell.textContent = subTask.title;
            titleCell.style.width = '34%';

            let date: string[] = subTask.deadline.split("-");
            let deadline: string[] = [];
            deadline.push(date[0]);
            deadline.push(date[1]);
            let day = date[2].split('T')
            deadline.push(day[0]);
            deadline.push(day[1]);

            deadlineCell.textContent = `${deadline[2]}.${deadline[1]}.${deadline[0]} ${deadline[3]}`;
            deadlineCell.style.width = '34%';
            importanceCell.style.width = '5%';
            editCell.style.width = '5%';
            editCell.style.display = 'inline-table';


            row.appendChild(titleCell);
            row.appendChild(deadlineCell);
            row.appendChild(importanceCell);
            row.appendChild(statusCell);
            row.appendChild(editCell);
            row.style.display= 'table-row';
            row.style.textAlignLast = 'center';

            if (tableBody) {
                tableBody.appendChild(row);
            }
        });
    }
}


function getTaskIdFromEditForm(): string[] {
    const str = (document.getElementById("editTaskId") as HTMLLabelElement).innerText;
    console.log(str);
    const subStrings = str.split(": ", 2);
    console.log(subStrings);
    return subStrings;
}
function getAssigneeFromEditForm(): string[] {
    const str = (document.getElementById("editAssign") as HTMLLabelElement).innerText;
    console.log(str);
    const subStrings = str.split(": ", 2);
    console.log(subStrings);
    return subStrings;
}

function showEditRepeat() {
    const repeat = document.getElementById('editRepeat') as HTMLInputElement;
    if (repeat.checked) {
        document.getElementById("editRepeating")!.style.visibility = "visible";
    } else {
        document.getElementById("editRepeating")!.style.visibility = "hidden";
    }
}

export default EditTaskPopup;