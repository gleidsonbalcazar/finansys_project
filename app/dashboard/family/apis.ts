import { apiUrls } from 'lib/apiUrls';

export type FamilyData = {
	name: string;
};

export const addFamily = async (data: FamilyData) => {
	const res = await fetch(apiUrls.family.add, { method: 'POST', body: JSON.stringify(data) });
	if (!res.ok) {
		const error = await res.json();
		throw error;
	}
	return await res.json();
};

export const deleteFamily = async (id: string) => {
	const res = await fetch(apiUrls.family.modify, { method: 'DELETE', body: JSON.stringify({ id: [id] }) });
	return await res.json();
};

export const editFamily = async (data: FamilyData) => {
	const res = await fetch(apiUrls.family.modify, { method: 'PUT', body: JSON.stringify(data) });
	return await res.json();
};
