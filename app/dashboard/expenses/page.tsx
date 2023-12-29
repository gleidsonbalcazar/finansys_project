import { DataContextProvider } from 'components/context/data-provider';
import LayoutHeader from 'components/layout/header';

import ExpensesSummary from './summary';
import ExpenseTable from './table';

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Despesas" />
			<DataContextProvider name="expenses">
				<div className="w-full overflow-x-auto p-4 pt-3">
					<ExpensesSummary />
					<ExpenseTable />
				</div>
			</DataContextProvider>
		</>
	);
}
