import { apiUrls } from 'lib/apiUrls';

export type AccountData = {
	name: string;
	description: string;
	active:boolean;
	created_at: string;
	update_at:string;
};

export const addAccount = async (data: AccountData) => {
	const res = await fetch(apiUrls.accounts.add, { method: 'POST', body: JSON.stringify(data) });
	if (!res.ok) {
		const error = await res.json();
		throw error;
	}
	return await res.json();
};

export const deleteAccount = async (id: string) => {
	const res = await fetch(apiUrls.accounts.modify, { method: 'DELETE', body: JSON.stringify({ id }) });
	return await res.json();
};

export const editAccount = async (data: AccountData) => {
	const res = await fetch(apiUrls.accounts.modify, { method: 'PATCH', body: JSON.stringify(data) });
	return await res.json();
};
