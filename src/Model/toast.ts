export enum TOAST_TYPE {
    SUCCESS = 1,
    INFO,
    WARN,
    ERROR
}

export interface Toast {
    toastType: TOAST_TYPE,
    msg: string
}