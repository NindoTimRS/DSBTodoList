import {h} from 'preact';
import '../style.scss';
import {useState, useEffect} from 'preact/hooks';
import {TaskService} from "../service/task-service";
import {TaskItem} from "../Model/TaskItem";
import EditSVG from "../icons/edit.svg"
import PrioLow from "../icons/low-priority.svg"
import PrioMedium from "../icons/medium-priority.svg"
import PrioHigh from "../icons/high-priority.svg"
import {SubTaskItem} from "../Model/SubTaskItem";
import {LoginService} from "../service/login-service";
import styles from "../styles/coulumn.module.scss";
import {DiscordService} from "../service/discord-service";
import {TOAST_TYPE} from "../Model/toast";
import {DiscordWebhook, Embed, Field} from "../Model/DiscordWebhook"

const ColumnData = ({reload, onEdit, search, onPut, onToast}) => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const taskService = new TaskService();
    const loginService = new LoginService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await taskService.GetAllTaskItem()
                let res = response.filter(taskItem => taskItem.title.toLowerCase().includes(search.toLowerCase()));
                setData(res)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [search]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await loginService.GetAllUser()
                setUsers(response)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchUsers();
    }, [reload]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await taskService.GetAllTaskItem()
                let change = false;
                for (let i = 0;i < response.length; i++){

                    if (refreshRepeat(response[i])) {
                        change = true;
                    }

                }

                if (change) {
                    onPut();
                }

                setData(response)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

    }, [reload]);
    if (loading) return <p>Loading...</p>;
    data.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
    const toDoData = data.filter((taskItem) => taskItem.status == "ToDo");
    const inProgData = data.filter((taskItem) => taskItem.status == "InProgress");
    const doneData = data.filter((taskItem) => taskItem.status == "Done");

    return (
        <div id={styles.columnGrid} class={`${styles.disabled}:disabled`}>
            {Table(users, toDoData, "ToDo", onEdit, onToast)}
            {Table(users, inProgData, "InProgress", onEdit, onToast)}
            {Table(users, doneData, "Done", onEdit, onToast)}
        </div>
    );
};

function refreshRepeat(taskItem: TaskItem) {
    let change: boolean = false;
    if (taskItem.repeat) {
        const deadline: string[] = SplitDate(taskItem.deadline);
        const today: string[] = SplitDate(new Date().toISOString());
        const deadlineDue = () => {

            if (+deadline[0] < +today[0]) {
                return true;
            } else if (+deadline[0] == +today[0]) {
                if (+deadline[1] < +today[1]) {
                    return true;
                } else if (+deadline[1] == +today[1]) {
                    if (+deadline[2] < +today[2]) {
                        return true;
                    }
                }
            }

            return false;
        }

        if (taskItem.status == "Done" || deadlineDue()) {
            taskItem.status = "ToDo";
            const date = new Date(taskItem.deadline);
            date.setDate(date.getDate() + taskItem.interval);
            taskItem.deadline = toDatetimeLocalString(date);

            const putTask = async () => {
                let taskService = new TaskService();
                const body = JSON.stringify(taskItem);
                await taskService.PutTaskItem(taskItem.task_id, body);

            }
            putTask();
            change = true;
        }
    }
    return change;
}

function toDatetimeLocalString(date: Date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}


function Table(users: {userId: number, username: string, group: string, email: string }[], data: TaskItem[], status: string, onEdit, onToast) {
    const divId = `${status.toLowerCase()}-column`;

    const ChangeAssignee = async (newUser: string, taskItem: TaskItem) => {
        const taskService = new TaskService();
        const Assignee: { assignment: string } = {assignment: newUser}
        const body = JSON.stringify(Assignee);
        const resPatch = await taskService.PatchTaskItem(taskItem.task_id, body);

        if (resPatch.status < 400){
            const resDis = await sendDiscordMessage(users, newUser, taskItem)

            if (resDis) {

                if (resDis.status < 400) {
                    onToast({toastType: TOAST_TYPE.SUCCESS, msg: (`Aufgabe wurde ${newUser} zugewiesen`)});
                } else {
                    onToast({toastType: TOAST_TYPE.WARN, msg: (`Es konnte keine Nachricht an ${newUser} gesendet werden!`)});
                }

            } else {
                onToast({toastType: TOAST_TYPE.INFO, msg: (`Zuweisung wurde entfernt!`)})
            }
            
        } else {
            onToast({toastType: TOAST_TYPE.ERROR, msg: (`Aufgabe konnte ${newUser} nicht zugewiesen werden!`)});
        }

    }

    return (
        <div class={styles.column} id={divId}>
            <h2 class={
                status == 'ToDo' ? styles.ToDoH2 :
                    status == 'InProgress' ? styles.InProgressH2 :
                        styles.DoneH2}>{status}</h2>
            <table className={styles.taskTable}>
                <tbody>
                {data.map((taskItem) => (
                    <tr>
                        <td class={styles.assignmentCell}>
                            <select id="assignUser"
                                    value={taskItem.assignment}
                                    onChange={(e) => ChangeAssignee((e.target as HTMLSelectElement).value, taskItem)}
                            >
                                <option>Unassigned</option>
                                {users.map((user) => (
                                    <option key={user.username} value={user.username}>{user.username}</option>
                                ))}
                            </select>
                        </td>
                        <td class={styles.titleCell}>{taskItem.title}</td>
                        <td class={DeadlineStyle(taskItem)}>{FormatDate(taskItem.deadline)}</td>
                        <td class={styles.importanceCell}>
                            <img class={styles.tableImg} src={SelectPrioImage(+taskItem.importance)}
                                 alt={taskItem.importance}/>
                        </td>
                        <td class={styles.editCell}>
                            <img className={styles.tableImg} src={EditSVG} alt="Edit"
                                 onClick={() => onEdit(taskItem)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export function FormatDate(inputDate: string): string {
    const deadline = SplitDate(inputDate);
    return `${deadline[2]}.${deadline[1]}.${deadline[0]} ${deadline[3]}:${deadline[4]}`;
}

async function sendDiscordMessage(users: { username: string; email: string }[], newUser: string, taskItem: TaskItem) {
    const user: {username: string, email: string}  = users.find(value => value.username == newUser)
    if (!user) {
     return null
    }
    let newUrl = new URL(window.location.href);
    let finalURL = "";

    if (!newUrl.searchParams.get("taskid")){

        if (newUrl.href.includes("?")){
            finalURL = newUrl.href + "taskid=" + taskItem.task_id;
        }else {
            finalURL = newUrl.href + "?taskid=" + taskItem.task_id;
        }

    }else {
        finalURL = newUrl.href;
    }

    const field: Field = {
        name: "Deadline:",
        value: FormatDate(taskItem.deadline),
        inline: true
    }

    const embed: Embed = {
        title: taskItem.title,
        url: finalURL,
        description: taskItem.description,
        color: 15258703,
        fields: [field]
    }

    const payload: DiscordWebhook = {
        content: `<@${user.email}> Dir wurde eine Aufgabe zugewiesen!`,
        embeds: [embed]
    }

    const body = JSON.stringify(payload)
    const discordService = new DiscordService();
    return await discordService.PostDiscordMessage(body);
}

function SplitDate(inputDate: string): string[] {
    let date: string[] = inputDate.split("-");
    let deadline: string[] = [];
    deadline.push(date[0]);
    deadline.push(date[1]);
    let day = date[2].split('T')
    deadline.push(day[0]);
    let time = day[1].substring(0, 5).split(':')
    deadline.push(time[0]);
    deadline.push(time[1]);
    return deadline;
}

export function DeadlineStyle(taskItem: TaskItem | SubTaskItem): string {
    if (taskItem.status == "Done") {
        return styles.deadlineCell;
    }
    const deadline = SplitDate(taskItem.deadline);
    const today = SplitDate(new Date().toISOString());

    if (+deadline[0] < +today[0]) {
        return styles.deadlineCellYesterday;
    } else if (+deadline[0] == +today[0]) {
        if (+deadline[1] < +today[1]) {
            return styles.deadlineCellYesterday;
        } else if (+deadline[1] == +today[1]) {
            if (+deadline[2] < +today[2]) {
                return styles.deadlineCellYesterday;
            } else if (+deadline[2] == +today[2]) {
                return styles.deadlineCellToday;
            }
        }
    }
    return styles.deadlineCell;
}

export function SelectPrioImage(prio: number): string {
    switch (prio) {
        case 1:
            return PrioLow;
        case 2:
            return PrioMedium;
        case 3:
            return PrioHigh;
        default:
            return '';
    }
}


export default ColumnData;