
import {PostTaskItem} from "./Model/PostTaskItem";
import {TaskService} from "./service/task-service";

const AddTaskPopup = ({onPost}) => {
    const postTask = async ()=> {
        const TaskItem: PostTaskItem = {
            status: "ToDo",
            title: (document.getElementById("title") as HTMLInputElement).value,
            description: (document.getElementById("description") as HTMLInputElement).value,
            deadline: (document.getElementById("deadline") as HTMLInputElement).value,
            importance: +(document.getElementById("priority") as HTMLInputElement).value,
            repeat: (document.getElementById("repeat") as HTMLInputElement).checked,
            interval: +(document.getElementById("priority") as HTMLInputElement).value,
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
        <div id="addTaskForm" class="addTaskForm visibleDisplay">
            <div>
                <h3>Add new Task!</h3>
            </div>
            <form onSubmit={postTask}>
                <div className="taskFormBody">
                    <label htmlFor="title">Title*</label>
                    <input className="AddInput" type="text" id="title" placeholder="Title" required/>
                    <br/>
                    <label htmlFor="description">Description*</label>
                    <textarea className="AddInput" id="description" placeholder="Description" required></textarea>
                    <br/>
                    <label htmlFor="deadline">Deadline*</label>
                    <input className="AddInput" type="datetime-local" id="deadline" required/>
                    <br/>
                    <label htmlFor="priority">Priority*</label>
                    <select className="AddInput" id="priority" required>
                        <option value="1">low</option>
                        <option value="2">medium</option>
                        <option value="3">high</option>
                    </select>
                    <br/>
                    <label htmlFor="repeat">Repeating task?</label>
                    <input className="AddInput" type="checkbox" onChange={changed} id="repeat" name="email"/>
                    <br/>
                    <div id="repeating" className="hidden">
                        <label htmlFor="interval">Repeating Interval:</label>
                        <input className="AddInput" type="number" id="interval" placeholder="Interval"/>
                    </div>
                    <br/>
                </div>
                <div className="confirmations">
                    <button className="submitButton" type="submit">Submit</button>
                    <button className="closeButton" type="button" onClick={() => ClearAddForm(true)}>Close</button>
                </div>
            </form>
        </div>
    );
};

function changed() {
    document.getElementById("repeating")!.classList.toggle("hidden");
}


function ClearAddForm(clearFrom: boolean) {
    ToggleAddTaskFormHtml();
    if (clearFrom) {
        let inputs = document.getElementsByClassName("AddInput");
        for (let input of inputs) {
            (input as HTMLInputElement).value = "";
            (input as HTMLInputElement).classList.remove("notFilled");
        }
    }
}

export function ToggleAddTaskFormHtml() {
    document.getElementById("addTaskForm")!.classList.toggle("visibleDisplay");
    document.getElementById('column-grid')!.classList.toggle('disabled');
    (document.getElementById('addButton')! as HTMLButtonElement).disabled = !(document.getElementById('addButton')! as HTMLButtonElement).disabled;
}



export default AddTaskPopup;