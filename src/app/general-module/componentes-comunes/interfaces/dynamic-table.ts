export interface DynamicHeaderTable<T> {
    id: string,
    nameColum: string,
    actions?: DynamicBtnTable<T>[]
    child?: {
        type: "text" | "link" | "linkedColumn" | "check",
        onClick: (item: T | any) => void,
        onheaderEvent?: (item: T | any) => void,
    }
}

export interface DynamicBtnTable<T> {
    btnName: string;
    btnKey: string;
    btnIcon?: string;
    btnColor?: string;
    disabledWhen?: (item: T) => boolean;
    hiddenWhen?: (item: T) => boolean;
    onClick: (item: T | any) => void | ((item: T, index: number) => void);
    type?: "default" | "index"
}

export interface DynamicDataTable<T> {
    header: DynamicHeaderTable<T>[],
    data: T[],
    showFilter?: boolean,
    noColum: number[]
}

