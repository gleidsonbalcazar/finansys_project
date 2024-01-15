import { formatDate } from './formatter';

const dateStyle = { day: '2-digit', year: '2-digit', month: 'short' };

export const sortByKey = (arr: Array<any>, key: string) => {
	return arr.sort((a, b) => (a[key] < b[key] ? 1 : -1));
};

export const extractValues = (data: Array<Object>, locale: string) => {
	const groupByDate = data.reduce((acc: any, datum: any) => {
		const date = formatDate({ date: datum.date, locale, dateStyle });
		acc[date] = acc[date]
			? {
					...acc[date],
					[datum.budget.name]: acc[date][datum.budget.name]
						? acc[date][datum.budget.name] + Number(datum.value)
						: Number(datum.value),
			  }
			: { date, [datum.budget.name]: Number(datum.value) };

		return acc;
	}, {});

	return Object.values(groupByDate).reverse();
};

export const extractBudgets = (data: Array<Object>) => {
	return Object.keys(
		data.reduce((acc: any, datum: any) => {
			acc[datum.budget.name] = true;
			return acc;
		}, {})
	);
};

export const extractChartAxis = (data: Array<Object>) => data.sort((a: any, b: any) => b - a);

export const extractRecentData = (
	expenses: Array<Object>,
	income: Array<Object>
) => {

	if (expenses.length || income.length) {
		const allData = [
			...expenses.map((datum) => ({ ...datum, from: 'expenses' })),
			...income.map((datum) => ({ ...datum, from: 'income' })),
		];
		return sortByKey(allData, 'updated_at').filter((_, index) => index <= 4);
	}
	return [];
};

const sortValueByAsc = (a: any, b: any) => (a.value > b.value ? -1 : 1);

type DatumReturn = {
	[key: string]: {
		id: number,
		name: string;
		value: number;
		executed: string;
	};
};

type Datum = {
	budget: string;
	value: string;
};

export const extractTopExpenseCategories = (data: Array<Object>) => {
	const dataMap = data.reduce<DatumReturn>((acc: any, datum: any) => {
		acc[datum.budget.name] = {
			name: `${datum.budget.name}`,
			value: acc[datum.budget.name] ? Number(acc[datum.budget.name].value) + Number(datum.value) : Number(datum.value),
			executed: datum.executed
		};

		return acc;
	}, {});

	return Object.values(dataMap)
		.sort(sortValueByAsc)
		.filter((_, index) => index <= 5);
};

function calculateRemainingExpenses(budgets: any[], expenses: any[]): number {
	let remainingTotal = 0;

	budgets.forEach(budget => {
			const correspondingExpenses = expenses.filter(expense => expense.budget_id === budget.id && expense.executed);

			if (correspondingExpenses.length > 0) {
					const executedExpensesTotal = correspondingExpenses.reduce((total, expense) => total + parseFloat(expense.value), 0);
					const remainingAmount = parseFloat(budget.value) - executedExpensesTotal;
					remainingTotal += remainingAmount;
			} else {
					remainingTotal += parseFloat(budget.value);
			}
	});

	return remainingTotal;
}

function findUnassociatedExpenses(budgets: any[], expenses: any[]): number {
	const unassociatedExpenses: any[] = [];

	expenses.forEach(expense => {
			const budgetExists = budgets.some(budget => budget.id === expense.budget_id);

			if (expense.executed && !budgetExists) {
					unassociatedExpenses.push(expense);
			}

	});

	return unassociatedExpenses.reduce((total,item) => total + parseFloat(item.value),0);
}

export const extractTotalByTypeBudget = (typeBudget: string, data: Array<any>, attribute: string = 'value') => {
	console.log(data);
	return data.filter(f => f.typeLaunch == typeBudget).reduce((total, item) =>  total + parseFloat(item[attribute]),0);
}

export const extractActualView = (dataExpenses: Array<any>, dataBudgets: Array<any>, dataIncome: Array<any>, dataInvestments: Array<any>) => {
	const expensesExecuted: number = dataExpenses.filter(f=> f.executed).reduce((total, item) =>  total + parseFloat(item.value),0);
	const expensesTarget: number = extractTotalByTypeBudget('expense', dataBudgets, 'value');//dataBudgets.filter(f => f.typeLaunch == 'expense').reduce((total, item) =>  total + parseFloat(item.value),0);
	const remainingExpensesTotal: number = calculateRemainingExpenses(dataBudgets.filter(f => f.typeLaunch == 'expense'), dataExpenses);
	const expensesNotPlanned: number = findUnassociatedExpenses(dataBudgets.filter(f => f.typeLaunch == 'expense' && f.isDefault), dataExpenses);

	const incomesExecuted: number = dataIncome.filter(f=> f.executed).reduce((total, item) =>  total + parseFloat(item.value) , 0);
	const incomesTarget: number = extractTotalByTypeBudget('income', dataBudgets, 'value');//dataBudgets.filter(f => f.typeLaunch == 'income').reduce((total, item) =>  total + parseFloat(item.value) , 0);
	const remainingIncomesTotal: number = calculateRemainingExpenses(dataBudgets.filter(f => f.typeLaunch == 'income'), dataIncome);
	const incomesNotPlanned: number = findUnassociatedExpenses(dataBudgets.filter(f => f.typeLaunch == 'income' && f.isDefault), dataIncome);

	const investmentsExecuted: number = dataInvestments.filter(f => f.executed).reduce((total, item) =>  total + parseFloat(item.value),0);
	const investmentsTarget: number = dataBudgets.filter(f => f.typeLaunch == 'investment').reduce((total, item) =>  total + parseFloat(item.value) , 0);
	const remainingInvestmentsTotal: number = calculateRemainingExpenses(dataBudgets.filter(f => f.typeLaunch == 'investment'), dataInvestments);
	const investmentsNotPlanned: number = findUnassociatedExpenses(dataBudgets.filter(f => f.typeLaunch == 'investment'), dataInvestments);


	let dataMapOwner = {
		expensesExecuted,
		expensesTarget,
		remainingExpensesTotal,
		expensesNotPlanned,
		incomesExecuted,
		incomesTarget,
		remainingIncomesTotal,
		incomesNotPlanned,
		investmentsExecuted,
		investmentsTarget,
		remainingInvestmentsTotal,
		investmentsNotPlanned
	} as any;

	return dataMapOwner;
};

export const extractOverviewBybudgets = (dataExpenses: Array<any>,dataBudgets: Array<any>,dataIncome: Array<any>) => {
  const dataExtracted = dataExpenses.concat(dataIncome);

	const dataMapExecuted = dataExtracted.filter(f=> f.executed).reduce<DatumReturn>((acc: any, datum: any) => {
		acc[datum.budget_id] = {
			id: `${datum.budget_id}`,
			name: `${datum.name}`,
			value: acc[datum.budget_id] ? Number(acc[datum.budget_id].value) + Number(datum.value) : Number(datum.value),
		};
		return acc;
	}, {});


	const dataMapNotExecuted = dataExtracted.filter(f=> !f.executed).reduce<DatumReturn>((acc: any, datum: any) => {
		acc[datum.budget_id] = {
			id: `${datum.budget_id}`,
			name: `${datum.name}`,
			value: acc[datum.budget_id] ? Number(acc[datum.budget_id].value) + Number(datum.value) : Number(datum.value),
		};
		return acc;
	}, {});

	let dataMapOwner = dataBudgets?.map(val => ({
		id: val.id,
		name: val.name,
		value: 0,
		valueExecuted: 0,
		valueNotExecuted: 0,
		valueBudget: +val.value,
		isDefault: val.isDefault,
		typeLaunch: val.typeLaunch
	}));

	dataMapOwner.forEach(f => {
		let executed = Object.values(dataMapExecuted).filter(d => d.id == f.id);
		let notExecuted = Object.values(dataMapNotExecuted).filter(d => d.id == f.id);
		f.value = executed[0]?.value ?? 0 ;
		f.valueExecuted = executed[0]?.value ?? 0 ;
		f.valueNotExecuted = notExecuted[0]?.value ?? 0 ;
	})

	let filteredData = dataMapOwner.filter(item =>
    item.isDefault || (!item.isDefault && item.value > 0)
	);

	return Object.values(filteredData).sort((a, b) => a.name.localeCompare(b.name));
};

