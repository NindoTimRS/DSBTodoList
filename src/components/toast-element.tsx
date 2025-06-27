import styles from '../styles/toast.module.scss'
import {useEffect, useState} from "preact/hooks";
import {Toast, TOAST_TYPE} from "../Model/toast";


export default function ToastElement({toast}: { toast: Toast | null }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (toast) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);
    function getType():string {
        switch (toast.toastType) {
            case TOAST_TYPE.SUCCESS:
                return styles.success;
            case TOAST_TYPE.INFO:
                return styles.info;
            case TOAST_TYPE.WARN:
                return styles.warning;
            case TOAST_TYPE.ERROR:
                return styles.error;
            default:
                return '';
        }
    }
    if (!toast || !visible) return null;

    return (
        <div id={styles.toastContainer}>
            <div className={`${styles.toast} ${getType()}`}>
                {toast.msg}
            </div>
        </div>
    );
}