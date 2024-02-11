'use client';

import { createContext, useContext } from 'react';
import { format } from 'date-fns';
import useSWR from 'swr';
import { apiUrls } from 'lib/apiUrls';
import { dateFormat } from 'constants/date';
import { useDate } from './datepicker-provider';


const OverviewContext = createContext(null);

interface Data {
	expenses: Array<any>;
	income: Array<any>;
	budgets: Array<any>
}

export const OverviewContextProvider = (props: any) => {
	const { date } = useDate();
	const from = format(date.from || date.to, dateFormat);
	const to = format(date.to || date.from, dateFormat);
	const { children, ...others } = props;

	const swrOptions = { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false };
	const {	data: expensesData = [],	isLoading: isExpenseLoading,	mutate: mutateExpenses} = useSWR(apiUrls.expenses.getExpenses({ from, to }));
	const { data: incomeData = [], isLoading: isIncomeLoading, mutate: mutateIncomes } = useSWR(apiUrls.income.getIncome({ from, to }));
	const { data: budgetsData = [], isLoading: isBudgetLoading, mutate: mutateBudget } = useSWR(apiUrls.budget.getBudget({typeLaunch: "all"}), swrOptions);
	const { data: InvestmentsData = [], isLoading: isInvestmentsLoading, mutate: mutateInvestments } = useSWR(apiUrls.investments.getinvestments({ from, to }));
	const { data: accountsData = [], isLoading: isAccountsLoading, mutate: mutateAccounts } = useSWR(apiUrls.accounts.getBalanceAccounts({ showBalance: true }));

	const data = {
		expenses: expensesData,
		income: incomeData,
		budgets: budgetsData,
		investments: InvestmentsData,
		accounts: accountsData,
		mutate: {
			mutateExpenses,
			mutateIncomes,
			mutateBudget,
			mutateInvestments,
			mutateAccounts
		},
	};

	const loading = isExpenseLoading || isIncomeLoading || isBudgetLoading || isInvestmentsLoading || isAccountsLoading;

	return (
		<OverviewContext.Provider value={{ loading, data }} {...others}>
			{children}
		</OverviewContext.Provider>
	);
};

export const useOverview = () => {
	const context = useContext<any>(OverviewContext);
	if (context === undefined) {
		throw new Error(`useUser must be used within a OverviewContext.`);
	}
	return context;
};
