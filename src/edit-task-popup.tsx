import {TaskItem} from "./Model/TaskItem";
import {PostTaskItem} from "./Model/PostTaskItem"
import {TaskService} from "./service/task-service";
import trashBinImg from "./icons/trash-bin.svg"
import {h} from "preact";
import {SubTaskService} from "./service/subtask-service";
import headerStyles from "./styles/header.module.scss"
import columnStyles from "./styles/coulumn.module.scss"
import popupStyles from "./styles/popup.module.scss"
import {useEffect, useState} from "preact/hooks";
import {SubTaskItem} from "./Model/SubTaskItem";
import {TargetedEvent} from "react";
import {DeadlineStyle, SelectPrioImage} from "./column-container";
import EditSVG from "./icons/edit.svg"


const EditTaskPopup = ({onPut, openEdit, taskItem}:{onPut: any, openEdit:any, taskItem: TaskItem}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [deadline, setDeadline] = useState("");
    const [importance, setImportance] = useState("1");
    const [repeat, setRepeat] = useState(false);
    const [interval, setInterval] = useState(0);



    useEffect(() => {
        if (openEdit === null || !taskItem) return;
        const newUrl = new URL(window.location.href);
        if (!newUrl.searchParams.get("taskid")){
            newUrl.searchParams.set('taskid', `${taskItem.task_id}`);
            window.history.pushState({}, '', newUrl);
        }
       openEditTask(taskItem)
    }, [openEdit]);

    const openEditTask = (task: TaskItem) => {
        document.getElementById(popupStyles.editTaskForm)!.classList.toggle(popupStyles.visibleDisplay);
        document.getElementById(columnStyles.columnGrid)!.classList.add(columnStyles.disabled);
        const buttons = (document.getElementsByClassName(headerStyles.headInteractive)! as HTMLCollectionOf<HTMLButtonElement>)
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        document.getElementById("editTaskId")!.textContent = "Task ID: " + task.task_id
        document.getElementById("editAssign")!.textContent = "Assignee: " + task.assignment
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setDeadline(task.deadline);
        setImportance(task.importance);
        setRepeat(task.repeat);
        setInterval(task.interval);
    }

    let taskService = new TaskService();
    const putTask = async () => {
        const TaskItem: PostTaskItem = {
            status: status,
            title: title,
            description: description,
            deadline: deadline,
            importance: +importance,
            repeat: repeat,
            interval: interval,
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
    let subtasks: SubTaskItem[] | null;
    try {
        subtasks = taskItem.subTasks;
        subtasks.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
    }catch(err) {
        subtasks = null;
    }

    const hideEditTaskFormHtml = () => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('taskid');
        window.history.pushState({}, '', newUrl.pathname);
        document.getElementById(popupStyles.editTaskForm)!.classList.toggle(popupStyles.visibleDisplay);
        document.getElementById(columnStyles.columnGrid)!.classList.remove(columnStyles.disabled);
        const buttons = (document.getElementsByClassName(headerStyles.headInteractive)! as HTMLCollectionOf<HTMLButtonElement>)
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    }
    const updateStatusStyles = (subTaskItem: SubTaskItem) => {
        switch (subTaskItem.status) {
            case "ToDo":
                return popupStyles.subTaskToDO;
            case "InProgress":
                return popupStyles.subTaskInProgress;
            case "Done":
                return popupStyles.subTaskDone;
        }
    };

    const handleStatusChange = async (subTask: SubTaskItem, e: TargetedEvent<HTMLSelectElement, Event>) => {
        subTask.status = e.currentTarget.value as "ToDo"| "InProgress"| "Done"
        const subTaskService = new SubTaskService();
        const Status: { status: string } = {status: e.currentTarget.value}
        const body = JSON.stringify(Status);
        await subTaskService.PatchSubTaskItem(subTask.taskId, body);
    };

    const PriorityAlt = (prio: number) => {
        switch (prio) {
            case 1:
                return "ToDo";
            case 2:
                return "In Progress";
            case 3:
                return "Done";
        }
    }

    const statuses = ["ToDo", "InProgress", "Done"];

    return (
        <form id={popupStyles.editTaskForm} class={`${popupStyles.editTaskForm} ${popupStyles.visibleDisplay}`} onSubmit={putTask}>
            <div>
                <div id={popupStyles.editTaskFormHeader} class={popupStyles.editTaskFormHeader}>
                    <label id={"editTaskId"}>Task Id</label>
                    <label id={"editAssign"}>Assigned for</label>
                    <div class={popupStyles.topRightEdit}>
                        <button id={popupStyles.addSubTaskBtn}>+ New Subtask</button>
                        <img src={trashBinImg} id={popupStyles.deleteTask} alt="Delete" width="35" height="35"
                             onClick={deleteTask}></img>
                    </div>
                </div>

                <h3 id="editTitle" contenteditable
                    onBlur={(e) => {setTitle(e.currentTarget.innerText)}} >
                    {title}
                </h3>
            </div>
            <div class={popupStyles.taskFormBody}>
                <label for="editDescription">Description</label>
                <textarea class={popupStyles.editText} id={popupStyles.editDescription} rows={10} placeholder="Description"
                          required onChange={(e) => {setDescription(e.currentTarget.value)}} value={description}>
                </textarea>
                <br></br>
                <div class="editInputLine">
                    <div>
                        <label class={popupStyles.editLabel} for="editDeadline">Deadline:</label>
                        <input type="datetime-local" class={popupStyles.addInput} id="editDeadline" required
                        onChange={(e) => {setDeadline(e.currentTarget.value)}} value={deadline}>
                        </input>
                    </div>
                    <div>
                        <label class={popupStyles.editLabel} for="editPriority">Priority:</label>
                        <select class={popupStyles.addInput} id="editPriority" required
                                onChange={(e) => {setImportance(e.currentTarget.value)}} value={importance}>
                            <option value="1">low</option>
                            <option value="2">medium</option>
                            <option value="3">high</option>
                        </select>
                    </div>
                    <div>
                        <label class={popupStyles.editLabel} for="editStatus">Status:</label>
                        <select class={popupStyles.addInput} id="editStatus" required
                                onChange={(e) => {setStatus(e.currentTarget.value)}} value={status}>
                            <option value="ToDo">To Do</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                    <div>
                        <label class={popupStyles.editLabel} for="editRepeat">Repeating task?</label>
                        <input class={popupStyles.addInput} type="checkbox" onChange={(e) => setRepeat(e.currentTarget.checked)} id="editRepeat"
                               checked={repeat}></input>
                    </div>
                    <div id="editRepeating" style={{
                        visibility: repeat ? "visible" : "hidden",
                        pointerEvents: repeat ? "auto" : "none"
                    }}>
                        <label class={popupStyles.editLabel} for="editInterval">Repeating in</label>
                        <input class={popupStyles.addInput} type="number" id="editInterval" placeholder="0"></input>
                        <label style={"padding-top: 20px"} for="editInterval">Days!</label>
                    </div>
                </div>
                <h4 style="text-align: center">Sub-Tasks</h4>
                <div id="subtasks" style="display: flex; flex-direction: column">
                    <table id="subtaskTable" class="Task-Table">
                        <tbody>
                        {subtasks == null ?
                            <p>No subtasks yet!</p>
                            :
                            subtasks.map((subTaskItem) => (
                                <tr style={"display: table-row; textAlignLast: center"}>
                                    <td style={"width: 34%"}>{subTaskItem.title}</td>
                                    <td style={"width: 34%"}>{DeadlineStyle(subTaskItem)}</td>

                                    <td style={"width: 5%"}>
                                        <img className={columnStyles.tableImg} src={SelectPrioImage(+subTaskItem.importance)} alt={`Priority: ${PriorityAlt(+subTaskItem.importance)}`} />
                                    </td>

                                    <td style={"width: 22%"}>
                                        <select onChange={(e) => handleStatusChange(subTaskItem, e)}
                                                className={`${popupStyles.subTaskStatusBox} ${updateStatusStyles(subTaskItem)} ${popupStyles.editImg}`} value={subTaskItem.status}>
                                            {statuses.map((status) => (
                                                <option value={status}/>
                                            ))}
                                        </select>
                                    </td>

                                    <td style={"width: 5%; display: inline-table"}>
                                        <img className={columnStyles.tableImg} src={EditSVG} alt={"Edit"}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br></br>
                </div>



            </div>
            <div class={popupStyles.confirmations}>
                <button class={popupStyles.submitButton} type="submit">Confirm Changes</button>
                <button class={popupStyles.closeButton} type="button" onClick={hideEditTaskFormHtml}>Close</button>
            </div>
        </form>
    );
};

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

export default EditTaskPopup;