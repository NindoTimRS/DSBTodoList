import {h} from "preact";
import headerStyles from "../../styles/header.module.scss"
import columnStyles from "../../styles/coulumn.module.scss"
import popupStyles from "../../styles/popup.module.scss"
import {useEffect, useState} from "preact/hooks";


const EditTaskPopup404 = ({open404}) => {
    const [taskId, setTaskId] = useState("");



    useEffect(() => {
        if (open404 === null) return;
        const newUrl = new URL(window.location.href);
        const tId = newUrl.searchParams.get("taskid")
        if (tId){
            newUrl.searchParams.set("page", '404');
            window.history.pushState({}, '', newUrl);
            setTaskId(tId);
        }
        openEditTask()
    }, [open404]);

    const openEditTask = () => {
        document.getElementById(popupStyles.taskForm404)!.classList.toggle(popupStyles.visibleDisplay);
        document.getElementById(columnStyles.columnGrid)!.classList.add(columnStyles.disabled);
        document.getElementById(headerStyles.header)!.classList.toggle(headerStyles.active);
        const buttons = (document.getElementsByClassName(headerStyles.headInteractive)! as HTMLCollectionOf<HTMLButtonElement>)
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        document.getElementById("editTaskId")!.textContent = "Task ID: " + taskId

    }

    const hideEditTaskFormHtml = () => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('page');
        newUrl.searchParams.delete('taskid');
        window.history.pushState({}, '', newUrl.pathname);
        document.getElementById(popupStyles.taskForm404)!.classList.toggle(popupStyles.visibleDisplay);
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
        <form id={popupStyles.taskForm404} class={`${popupStyles.taskForm404} ${popupStyles.visibleDisplay}`} style={"  height: fit-content; width: fit-content;"}>
            <h2>Die Aufgabe mit der ID: {taskId} ist nicht verfügbar!</h2>
            <br/>
            <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" fill="none">
                <rect width="400" height="200" fill="#1b1b1b"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                      font-family="Arial, Helvetica, sans-serif"
                      font-size="200"
                      fill="#ffb400"
                      font-weight="bold"
                      letter-spacing="4">
                    404
                </text>
            </svg>
            <br/>
            <span>Diese Aufgabe existiert nicht.</span>
            <br/>
            <span>Überprüfe bitte ob diese gelöscht wurde oder versuch es später erneut.</span>
            <div className={popupStyles.confirmations}>
                <br/>
                <button className={popupStyles.closeButton} type="button" onClick={hideEditTaskFormHtml}>Close</button>
            </div>
        </form>
    );
};


export default EditTaskPopup404;