
import styles from './styles/header.module.scss';
import Logo from './icons/DSB_Logo.png';
import LogoutSVG from './icons/logout.svg';
import {logout} from "./auth";
import {ToggleAddTaskFormHtml} from "./add-task-popup";


export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img src={Logo} alt="DSB Logo" className={styles.logo}/>
                <h1>Willkommen zurück!</h1>
            </div>
            <div className={styles.right}>
                <button style={"visibility: hidden"} className={styles.iconBtn} title="Benachrichtigungen">🔔</button>
                <button className={styles.iconBtn} title="Einstellungen" onClick={ToggleAddTaskFormHtml}>+ Add Task</button>
                <button className={styles.iconBtn} title="Logout" onClick={logout}>
                    <img src={LogoutSVG} alt="Logout" className={styles.logout} />
                </button>
            </div>
        </header>
    );
}