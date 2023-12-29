import { apiUrls } from 'lib/apiUrls';

export type IncomeData = {
	name: string;
	value: string;
	date: string;
	user_id: number;
	executed: boolean;
	account_id: number;
	budget_id: number;
	id: string | null;
};

export const addIncome = async (data: IncomeData) => {
	const res = await fetch(apiUrls.income.add, { method: 'POST', body: JSON.stringify(data) });
	if (!res.ok) {
		const error = await res.json();
		throw error;
	}
	return await res.json();
};

export const deleteIncome = async (id: string) => {
	const res = await fetch(apiUrls.income.modify, { method: 'DELETE', body: JSON.stringify({ id: [id] }) });
	return await res.json();
};

export const executeIncome = async (id: string) => {
	const res = await fetch(apiUrls.income.execute, { method: 'PUT', body: JSON.stringify({ id: id }) });
	return await res.json();
};

export const editIncome = async (data: IncomeData) => {
	const res = await fetch(apiUrls.income.modify, { method: 'PUT', body: JSON.stringify(data) });
	return await res.json();
};
