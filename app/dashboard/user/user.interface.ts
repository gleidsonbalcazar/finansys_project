import { FamilyInterface } from "../family/family.interface";

export type UserInterface = {
	id: string;
	name: string;
	family: FamilyInterface;
	email: string;
	currency:string;
	locale:string;
	isUserAdmin: boolean;
	isMainFamily: boolean;
	defaultTheme: string;
};
