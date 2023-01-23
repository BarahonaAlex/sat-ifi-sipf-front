export interface SidebarOption {
    id: string;
    title: string;
    icon: string;
    route?: string;
    children?: SidebarOption[];
}