import {SubTaskItem} from "../../Model/SubTaskItem";
import {useEffect, useState} from "preact/hooks";
import popupStyles from "../../styles/popup.module.scss";
import trashBinImg from "../../icons/trash-bin.svg";
import {h} from "preact";
import {SubTaskService} from "../../service/subtask-service";
import {PostSubTaskItem} from "../../Model/PostSubTaskItem";
import {TOAST_TYPE} from "../../Model/toast";

const EditSubTaskPopup = ({onToast, subTaskItem, openSubEdit}:{onToast:any, openSubEdit:any, subTaskItem: SubTaskItem}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [deadline, setDeadline] = useState("");
    const [importance, setImportance] = useState("1");

    useEffect(() => {
        if (openSubEdit === null || !subTaskItem) return;
        ToggleEditSubTaskFormHtml(true);
    }, [openSubEdit]);

    const ToggleEditSubTaskFormHtml = (isOpened: boolean) => {
        document.getElementById("editSubTaskForm")!.classList.toggle(popupStyles.visibleDisplay);
        document.getElementById(popupStyles.editTaskForm)!.classList.toggle(popupStyles.visibleDisplay);
        if (isOpened) {
            setTimeout(() => {
                document.getElementById("editSubTaskId")!.textContent = "Task ID: " + subTaskItem.taskId
                document.getElementById("editSubSubTaskId")!.textContent = "Subtask ID: " + subTaskItem.subTaskId
                setTitle(subTaskItem.title);
                setDescription(subTaskItem.description);
                setStatus(subTaskItem.status);
                setDeadline(subTaskItem.deadline);
                setImportance(subTaskItem.importance);
            }, 100)
        }
    }

    let subTaskService = new SubTaskService();
    const putSubTask = async () => {
        const SubTaskItem: PostSubTaskItem = {
            taskId: +getIdFromEditForm("editSubTaskId")[1],
            status: status,
            title: title,
            description: description,
            deadline: deadline,
            importance: +importance
        };

        const body = JSON.stringify(SubTaskItem);
        const subStrings = getIdFromEditForm("editSubSubTaskId");
        await subTaskService.PatchSubTaskItem(subStrings[1], body);
        ToggleEditSubTaskFormHtml(false);

    }

    const deleteSubTask = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            const subStrings = getIdFromEditForm("editSubSubTaskId");
            const res = await subTaskService.DeleteSubTaskItem(subStrings[1]);
            if (res.status < 400) {
                onToast({toastType: TOAST_TYPE.SUCCESS, msg: (`Die Subtask wurde gelöscht`)});
                ToggleEditSubTaskFormHtml(false);
            } else {
                onToast({toastType: TOAST_TYPE.ERROR, msg: (`Die Subtask konnte nicht gelöscht werden.`)});
            }
        }
    }

    return (
        <form id={"editSubTaskForm"} className={`${popupStyles.editSubTaskForm} ${popupStyles.visibleDisplay}`}
        onSubmit={putSubTask}>
            <div>
                <div id={popupStyles.editSubTaskFormHeader} className={popupStyles.editSubTaskFormHeader}>
                    <label id={"editSubTaskId"}>Task Id</label>
                    <label id={"editSubSubTaskId"}>Subtask Id</label>
                    <div className={popupStyles.topRightEdit}>
                        <img src={trashBinImg} id={popupStyles.deleteTask} alt="Delete" width="35" height="35"
                             onClick={deleteSubTask}></img>
                    </div>
                </div>

                <h3 id="editTitle" contentEditable
                    onBlur={(e) => {
                        setTitle(e.currentTarget.innerText)
                    }}>
                    {title}
                </h3>
            </div>
            <div className={popupStyles.taskFormBody}>
                <label htmlFor="editDescription">Description</label>
                <textarea className={popupStyles.editText} id={popupStyles.editDescription} rows={23}
                          placeholder="Description"
                          required onChange={(e) => {
                    setDescription(e.currentTarget.value)
                }} value={description}>
                </textarea>
                <br></br>
                <div className="editInputLine">
                    <div>
                        <label className={popupStyles.editLabel} htmlFor="editDeadline">Deadline:</label>
                        <input type="datetime-local" className={popupStyles.addInput} id="editDeadline" required
                               onChange={(e) => {
                                   setDeadline(e.currentTarget.value)
                               }} value={deadline}>
                        </input>
                    </div>
                    <div>
                        <label className={popupStyles.editLabel} htmlFor="editPriority">Priority:</label>
                        <select className={popupStyles.addInput} id="editPriority" required
                                onChange={(e) => {
                                    setImportance(e.currentTarget.value)
                                }} value={importance}>
                            <option value="1">low</option>
                            <option value="2">medium</option>
                            <option value="3">high</option>
                        </select>
                    </div>
                    <div>
                        <label className={popupStyles.editLabel} htmlFor="editStatus">Status:</label>
                        <select className={popupStyles.addInput} id="editStatus" required
                                onChange={(e) => {
                                    setStatus(e.currentTarget.value)
                                }} value={status}>
                            <option value="ToDo">To Do</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                </div>

            </div>
            <div className={popupStyles.confirmations}>
                <button className={popupStyles.submitButton} type="submit" >Confirm Changes</button>
                <button className={popupStyles.closeButton} type="button" onClick={() => ToggleEditSubTaskFormHtml(false)}>Close</button>
            </div>
        </form>
    )
}

export default EditSubTaskPopup;

function getIdFromEditForm(element: string): string[] {
    const str = (document.getElementById(element) as HTMLLabelElement).innerText;
    console.log(str);
    const subStrings = str.split(": ", 2);
    console.log(subStrings);
    return subStrings;
}