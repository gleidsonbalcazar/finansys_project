import { apiUrls } from 'lib/apiUrls';

export type BudgetData = {
	name: string;
};

export const addBudget = async (data: BudgetData) => {
	const res = await fetch(apiUrls.budget.add, { method: 'POST', body: JSON.stringify(data) });
	if (!res.ok) {
		const error = await res.json();
		throw error;
	}
	return await res.json();
};

export const deleteBudget = async (id: string) => {
	const res = await fetch(apiUrls.budget.modify, { method: 'DELETE', body: JSON.stringify({ id: [id] }) });
	return await res.json();
};

export const editBudget = async (data: BudgetData) => {
	const res = await fetch(apiUrls.budget.modify, { method: 'PUT', body: JSON.stringify(data) });
	return await res.json();
};
