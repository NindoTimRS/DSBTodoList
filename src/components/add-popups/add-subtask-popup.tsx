import popupStyles from "../../styles/popup.module.scss"
import {useState, useEffect} from "preact/hooks";
import {PostSubTaskItem} from "../../Model/PostSubTaskItem";
import {SubTaskService} from "../../service/subtask-service";


const AddSubTaskPopup = ({taskId, openSubAdd}:{openSubAdd:any, taskId: number}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [importance, setImportance] = useState("1");

    useEffect(() => {
        if (openSubAdd === null || !taskId) return;
        ToggleAddSubTaskFormHtml();
    }, [openSubAdd]);

    const ToggleAddSubTaskFormHtml = () => {
        document.getElementById("addSubTaskForm")!.classList.toggle(popupStyles.visibleDisplay);
        document.getElementById(popupStyles.editTaskForm)!.classList.toggle(popupStyles.visibleDisplay);
    }

    const ClearAddForm = (clearFrom: boolean) => {
        ToggleAddSubTaskFormHtml();
        if (clearFrom) {
            let inputs = document.getElementsByClassName(popupStyles.addSubInputs);
            for (let input of inputs) {
                (input as HTMLInputElement).value = "";
                (input as HTMLInputElement).classList.remove(popupStyles.notFilled);
            }
        }
    }

    const postSubTask = async ()=> {
        const SubTaskItem: PostSubTaskItem = {
            taskId: taskId,
            status: "ToDo",
            title: title,
            description: description,
            deadline: deadline,
            importance: +importance,
        };
        let subTaskService = new SubTaskService();
        const body = JSON.stringify(SubTaskItem);
        try {
            await subTaskService.PostSubTaskItem(body)
        }catch(error) {
            console.log(error);
        }
        ClearAddForm(true);
        window.location.reload()
    }

    return (
        <div id={"addSubTaskForm"} className={`${popupStyles.addTaskForm} ${popupStyles.visibleDisplay}`}>
            <div className={popupStyles.AddSubtaskHeader}>
                <label htmlFor="taskId">Task ID:</label>
                <label className={popupStyles.AddSubInput} id="taskId">{taskId}</label>
                <br/>
                <h3>Add new Sub-Task!</h3>
            </div>
            <form onSubmit={postSubTask}>
                <div className={popupStyles.taskFormBody}>

                    <label htmlFor="title">Title*</label>
                    <input className={popupStyles.AddSubInput} type="text" id="title" placeholder="Title"  required
                           onInput={(e) => setTitle(e.currentTarget.value)}/>
                    <br/>
                    <label htmlFor="description">Description*</label>
                    <textarea className={popupStyles.AddSubInput} id="description" placeholder="Description" required
                              onInput={(e) => setDescription(e.currentTarget.value)}></textarea>
                    <br/>
                    <label htmlFor="deadline">Deadline*</label>
                    <input className={popupStyles.AddSubInput} type="datetime-local" id="deadline" required
                           onInput={(e) => setDeadline(e.currentTarget.value)}/>
                    <br/>
                    <label htmlFor="priority">Priority*</label>
                    <select className={popupStyles.AddSubInput} id="priority" required
                            onInput={(e) => setImportance(e.currentTarget.value)}>
                        <option value="1">low</option>
                        <option value="2">medium</option>
                        <option value="3">high</option>
                    </select>
                    <br/>
                </div>
                <div className={popupStyles.confirmations}>
                    <button className={popupStyles.submitButton} type="submit">Submit</button>
                    <button className={popupStyles.closeButton} type="button" onClick={() => ClearAddForm(true)}>Close
                    </button>
                </div>
            </form>
        </div>
    )

}

export default AddSubTaskPopup;