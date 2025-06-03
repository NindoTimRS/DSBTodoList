
import {PostTaskItem} from "../../Model/PostTaskItem";
import {TaskService} from "../../service/task-service";
import headerStyles from "../../styles/header.module.scss"
import columnStyles from "../../styles/coulumn.module.scss"
import popupStyles from "../../styles/popup.module.scss"
import {useState} from "preact/hooks";

const AddTaskPopup = ({onPost}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [importance, setImportance] = useState("1");
    const [repeat, setRepeat] = useState(false);
    const [interval, setInterval] = useState("0");
    const postTask = async ()=> {
        const TaskItem: PostTaskItem = {
            status: "ToDo",
            title: title,
            description: description,
            deadline: deadline,
            importance: +importance,
            repeat: repeat,
            interval: +interval,
            assignment: null
        };
        let taskService = new TaskService();
        const body = JSON.stringify(TaskItem);
        let result = await taskService.PostTaskItem(body);
        console.log(result);
        ToggleAddTaskFormHtml();
        onPost();
    }

    return (
        <div id={popupStyles.addTaskForm} class={`${popupStyles.addTaskForm} ${popupStyles.visibleDisplay}`}>
            <div>
                <h3>Add new Task!</h3>
            </div>
            <form onSubmit={postTask}>
                <div className={popupStyles.taskFormBody}>
                    <label htmlFor="title">Title*</label>
                    <input className={popupStyles.addInput} type="text" id="title" placeholder="Title" required onInput={(e) => setTitle(e.currentTarget.value)}/>
                    <br/>
                    <label htmlFor="description">Description*</label>
                    <textarea className={popupStyles.addInput} id="description" placeholder="Description" required onInput={(e) => setDescription(e.currentTarget.value)}></textarea>
                    <br/>
                    <label htmlFor="deadline">Deadline*</label>
                    <input className={popupStyles.addInput} type="datetime-local" id="deadline" required onInput={(e) => setDeadline(e.currentTarget.value)}/>
                    <br/>
                    <label htmlFor="priority">Priority*</label>
                    <select className={popupStyles.addInput} id="priority" required onInput={(e) => setImportance(e.currentTarget.value)}>
                        <option value="1">low</option>
                        <option value="2">medium</option>
                        <option value="3">high</option>
                    </select>
                    <br/>
                    <label htmlFor="repeat">Repeating task?</label>
                    <input className={popupStyles.addInput} type="checkbox" onChange={changed} id="repeat" name="email" onInput={(e) => setRepeat(e.currentTarget.checked)}/>
                    <br/>
                    <div id="repeating" className={popupStyles.hidden}>
                        <label htmlFor="interval">Repeating Interval:</label>
                        <input className={popupStyles.addInput} type="number" id="interval" placeholder="Interval" onInput={(e) => setInterval(e.currentTarget.value)}/>
                    </div>
                    <br/>
                </div>
                <div className={popupStyles.confirmations}>
                    <button className={popupStyles.submitButton} type="submit">Submit</button>
                    <button className={popupStyles.closeButton} type="button" onClick={() => ClearAddForm(true)}>Close</button>
                </div>
            </form>
        </div>
    );
};

function changed() {
    document.getElementById("repeating")!.classList.toggle(popupStyles.hidden);
}


function ClearAddForm(clearFrom: boolean) {
    ToggleAddTaskFormHtml();
    if (clearFrom) {
        let inputs = document.getElementsByClassName(popupStyles.addInput);
        for (let input of inputs) {
            (input as HTMLInputElement).value = "";
            (input as HTMLInputElement).classList.remove(popupStyles.notFilled);
        }
    }
}

export function ToggleAddTaskFormHtml() {
    document.getElementById(popupStyles.addTaskForm)!.classList.toggle(popupStyles.visibleDisplay);
    document.getElementById(columnStyles.columnGrid)!.classList.toggle(columnStyles.disabled);
    document.getElementById(headerStyles.header)!.classList.toggle(headerStyles.active);
    const buttons = (document.getElementsByClassName(headerStyles.headInteractive)! as HTMLCollectionOf<HTMLButtonElement>)
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = !buttons[i].disabled;
    }
}



export default AddTaskPopup;