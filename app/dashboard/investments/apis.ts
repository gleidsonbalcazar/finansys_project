import { apiUrls } from 'lib/apiUrls';

export type InvestmentsData = {
	name: string;
	value: string;
	date: string;
	user_id: number;
	executed: boolean;
	account_id: number;
	id: string | null;
};

export const addInvestments = async (data: InvestmentsData) => {
	const res = await fetch(apiUrls.investments.add, { method: 'POST', body: JSON.stringify(data) });
	if (!res.ok) {
		const error = await res.json();
		throw error;
	}
	return await res.json();
};

export const deleteInvestments = async (id: string) => {
	const res = await fetch(apiUrls.investments.modify, { method: 'DELETE', body: JSON.stringify({ id: [id] }) });
	return await res.json();
};

export const executeInvestments = async (id: string) => {
	const res = await fetch(apiUrls.investments.execute, { method: 'PUT', body: JSON.stringify({ id: id }) });
	return await res.json();
};

export const editInvestments = async (data: InvestmentsData) => {
	const res = await fetch(apiUrls.investments.modify, { method: 'PUT', body: JSON.stringify(data) });
	return await res.json();
};
