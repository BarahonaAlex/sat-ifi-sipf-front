export type FileState = 'preparing' | 'valid' | 'uploading' | 'uploaded' | 'error' | 'none';
export interface FileChange {
    state: FileState;
    file?: {
        id: string;
        name: string;
    }
    error?: string;
}