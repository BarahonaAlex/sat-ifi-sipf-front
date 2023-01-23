import { SidebarOption } from "./sidebar-option.interface";

export interface UserLogged {
	ip: string;
	loggedSince: string;
	login: string;
	nit: string;
	name: string;
	options: SidebarOption[];
}