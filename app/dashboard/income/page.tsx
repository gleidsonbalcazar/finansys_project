import { DataContextProvider } from 'components/context/data-provider';
import LayoutHeader from 'components/layout/header';
import IncomeSummary from './summary';
import IncomeTable from './table';

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Receitas" />
			<DataContextProvider name="income">
				<div className="w-full overflow-x-auto p-4 pt-3">
					<IncomeSummary />
					<IncomeTable />
				</div>
			</DataContextProvider>
		</>
	);
}
