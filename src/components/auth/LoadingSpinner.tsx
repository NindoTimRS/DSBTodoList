import styles from "../../styles/loadingSpinner.module.scss"
const LoadingSpinner = () => {
    return (
        <div class={styles.spinnerContainer}>
            <div class={styles.spinner}></div>
        </div>
    );
};

export default LoadingSpinner;