import {TaskItem} from "../../Model/TaskItem";
import {PostTaskItem} from "../../Model/PostTaskItem"
import {TaskService} from "../../service/task-service";
import trashBinImg from "../../icons/trash-bin.svg"
import {h} from "preact";
import {SubTaskService} from "../../service/subtask-service";
import headerStyles from "../../styles/header.module.scss"
import columnStyles from "../../styles/coulumn.module.scss"
import popupStyles from "../../styles/popup.module.scss"
import {useEffect, useState} from "preact/hooks";
import {SubTaskItem} from "../../Model/SubTaskItem";
import {TargetedEvent} from "react";
import {FormatDate, SelectPrioImage} from "../column-container";
import EditSVG from "../../icons/edit.svg"
import {TOAST_TYPE} from "../../Model/toast";


const EditTaskPopup = ({onToast, onPut, openEdit, taskItem, onSubAdd, onSubEdit}:{onToast:any, onPut: any, openEdit:any, taskItem: TaskItem, onSubAdd: any, onSubEdit: any}) => {
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
        setTimeout(() => {
            document.getElementById(popupStyles.editTaskForm)!.classList.toggle(popupStyles.visibleDisplay);
            document.getElementById(columnStyles.columnGrid)!.classList.add(columnStyles.disabled);
            document.getElementById(headerStyles.header)!.classList.toggle(headerStyles.active);
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
        }, 100);
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
        document.getElementById(headerStyles.header)!.classList.toggle(headerStyles.active);
        const buttons = (document.getElementsByClassName(headerStyles.headInteractive)! as HTMLCollectionOf<HTMLButtonElement>)
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    }

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

    return (
        <form id={popupStyles.editTaskForm} class={`${popupStyles.editTaskForm} ${popupStyles.visibleDisplay}`} onSubmit={putTask}>
            <div>
                <div id={popupStyles.editTaskFormHeader} class={popupStyles.editTaskFormHeader}>
                    <label id={"editTaskId"}>Task Id</label>
                    <label id={"editAssign"}>Assigned for</label>
                    <div class={popupStyles.topRightEdit}>
                        <button type="button" id={popupStyles.addSubTaskBtn} onClick={() => onSubAdd(taskItem.task_id)}>
                            <span className={popupStyles.desktopOnly}> + </span><span className={headerStyles.desktopOnly}>Add Subtask</span>
                        </button>
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
                        <label className={popupStyles.editLabel} htmlFor="editRepeat">Repeating task?</label>
                        <input class={popupStyles.addInput} type="checkbox"
                               onChange={(e) => setRepeat(e.currentTarget.checked)} id="editRepeat"
                               checked={repeat}></input>
                    </div>
                    <div id="editRepeating" style={{
                        visibility: repeat ? "visible" : "hidden",
                        pointerEvents: repeat ? "auto" : "none"
                    }}>
                        <label className={popupStyles.editLabel} htmlFor="editInterval">Repeating in</label>
                        <input class={popupStyles.addInput} type="number" id="editInterval" placeholder="0"
                               onChange={(e) => {setInterval(+e.currentTarget.value)}} value={interval}>
                        </input>
                        <label style={"padding-top: 20px"} htmlFor="editInterval">Days!</label>
                    </div>
                </div>
                <h4 style="text-align: center">Sub-Tasks</h4>
                <div id={popupStyles.subtasks} style="display: flex; flex-direction: column">
                    <table id={popupStyles.subtaskTable} class="TaskTable">
                        <tbody>
                        {subtasks == null ?
                            <p>No subtasks yet!</p>
                            :
                            subtasks.map((subTaskItem) => {
                                const [statusStyle, setStatusStyle] = useState<string>();
                                const updateStatusStyles = (status: string) => {
                                    switch (status) {
                                        case "ToDo":
                                            setStatusStyle(popupStyles.subTaskToDO)
                                            break;
                                        case "InProgress":
                                            setStatusStyle(popupStyles.subTaskInProgress);
                                            break;
                                        case "Done":
                                            setStatusStyle(popupStyles.subTaskDone);
                                            break;
                                    }
                                    return statusStyle;
                                };
                                const handleStatusChange = async (subTask: SubTaskItem, e: TargetedEvent<HTMLSelectElement, Event>) => {
                                    subTask.status = e.currentTarget.value as "ToDo"| "InProgress"| "Done"
                                    const subTaskService = new SubTaskService();
                                    const Status: { status: string } = {status: e.currentTarget.value}
                                    const body = JSON.stringify(Status);
                                    const res = await subTaskService.PatchSubTaskItem(subTask.subTaskId, body);
                                    if (res.status < 400) {
                                        updateStatusStyles(Status.status);
                                        onToast({toastType: TOAST_TYPE.SUCCESS, msg: (`Status wurde auf ${Status.status} gesetzt`)});
                                    } else {
                                        onToast({toastType: TOAST_TYPE.ERROR, msg: (`Der Status konnte nicht angepasst werden`)});
                                    }
                                };

                                return (
                                    <tr style={"display: table-row; textAlignLast: center;"}>
                                        <td style={"width: 34%"} onTouchEnd={() => {onSubEdit(subTaskItem)}}>{subTaskItem.title}</td>
                                        <td style={`width: 34%`}>{FormatDate(subTaskItem.deadline)}</td>

                                        <td style={"width: 5%"}>
                                            <img className={columnStyles.tableImg} src={SelectPrioImage(+subTaskItem.importance)} alt={`Priority: ${PriorityAlt(+subTaskItem.importance)}`} />
                                        </td>

                                        <td style={"width: 22%"}>
                                            <select onChange={(e) => handleStatusChange(subTaskItem, e)}
                                                    className={`${popupStyles.subTaskStatusBox} ${statusStyle ? statusStyle : updateStatusStyles(subTaskItem.status)} `} value={subTaskItem.status}>
                                                <option style={"color: white"} value="ToDo">To Do</option>
                                                <option style={"color: aquamarine"} value="InProgress">In Progress</option>
                                                <option style={"color: green"} value="Done">Done</option>
                                            </select>
                                        </td>

                                        <td class={popupStyles.subTableEdit}>
                                            <img className={columnStyles.tableImg} src={EditSVG} alt={"Edit"} onClick={() => onSubEdit(subTaskItem)}/>
                                        </td>
                                    </tr>
                                )
                            })}
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