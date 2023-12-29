import { DataContextProvider } from 'components/context/data-provider';
import LayoutHeader from 'components/layout/header';
import BudgetTable from './table';

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Orçamentos" />
			<DataContextProvider name="budget" isNotRange>
				<div className="w-full overflow-x-auto p-4 pt-3">
					<BudgetTable />
				</div>
			</DataContextProvider>
		</>
	);
}
