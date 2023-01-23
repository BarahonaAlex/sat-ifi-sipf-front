
export interface EntryNodoAcs {
    aspectNames: [
        string
    ],
    createdAt: string,
    id: string,
    idv: string,
    isFile: boolean,
    isFolder: boolean,
    modifiedAt: string,
    name: string,
    properties: { name: string, key: string }[],
    ruta?: string,
    icon?: string,
}

export interface EntryProperties {
	aspectNames: string[];
	nodeType: string;
	properties: object;
}

export interface ListaNodosAcs {
    list: {
        entries: [
            {
                entry: EntryNodoAcs,
            }
        ],
        pagination: {
            count: number,
            hasMoreItems: boolean,
            totalItems: number
        }
    }
}