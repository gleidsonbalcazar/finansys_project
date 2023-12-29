import { apiUrls } from 'lib/apiUrls';

export type ExpenseData = {
	name: string;
	value: string;
	date: string;
	user_id: number;
	executed: boolean;
	account_id: number;
	budget_id: number;
	id: string | null;
};

export const addExpense = async (data: ExpenseData) => {
	const res = await fetch(apiUrls.expenses.add, { method: 'POST', body: JSON.stringify(data) });
	if (!res.ok) {
		const error = await res.json();
		throw error;
	}
	return await res.json();
};

export const deleteExpense = async (id: string) => {
	const res = await fetch(apiUrls.expenses.modify, { method: 'DELETE', body: JSON.stringify({ id: [id] }) });
	return await res.json();
};

export const executeExpense = async (id: string) => {
	const res = await fetch(apiUrls.expenses.execute, { method: 'PUT', body: JSON.stringify({ id: id }) });
	return await res.json();
};

export const editExpense = async (data: ExpenseData) => {
	const res = await fetch(apiUrls.expenses.modify, { method: 'PUT', body: JSON.stringify(data) });
	return await res.json();
};
