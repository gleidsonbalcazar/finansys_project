import { apiUrls } from 'lib/apiUrls';

export type UserData = {
	email: string;
	name: string;
	currency: string;
	locale:string;
};

export const addUser = async (data: UserData) => {
	const res = await fetch(apiUrls.user.add, { method: 'POST', body: JSON.stringify(data) });
	if (!res.ok) {
		const error = await res.json();
		throw error;
	}
	return await res.json();
};

export const deleteUser = async (id: string) => {
	const res = await fetch(apiUrls.user.modify, { method: 'DELETE', body: JSON.stringify({ id }) });
	return await res.json();
};

export const editUser = async (data: UserData) => {
	const res = await fetch(apiUrls.user.modify, { method: 'PATCH', body: JSON.stringify(data) });
	return await res.json();
};


