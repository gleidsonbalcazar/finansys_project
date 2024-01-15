'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import useSWR from 'swr';

import { views } from 'constants/table';
import { getApiUrl } from 'constants/url';
import { apiUrls } from 'lib/apiUrls';

const DataContext = createContext(null);

interface Data {
	Data: Array<any>;
}

type Props = {
	children: React.ReactNode;
	name: string;
	isNotRange?: boolean;
};

export const DataContextProvider = (props: Props) => {
	const { children, name, isNotRange = false } = props;
	const [filter, setFilter] = useState(views.thisMonth.key);
	const [budgets, setBudgets] = useState<string[]>([]);

	const { data = [], mutate, isLoading } = useSWR(getApiUrl(filter, name, isNotRange));

	const onFilter = useCallback((budgets: string[] = []) => {
		//console.log(budgets);
		setBudgets(budgets);
	}, []);


	const value = useMemo(
		() => ({ data, loading: isLoading, filter: { name: filter, setFilter, onFilter }, mutate }),
		[data, isLoading, filter, mutate, onFilter]
	);

	return <DataContext.Provider value={value as any}>{children}</DataContext.Provider>;
};

export const useData = () => {
	const context = useContext<any>(DataContext);
	if (context === undefined) {
		throw new Error(`useData must be used within a DataContext.`);
	}
	return context;
};
