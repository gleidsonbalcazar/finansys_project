import { DataContextProvider } from 'components/context/data-provider';
import LayoutHeader from 'components/layout/header';

import InvestmentsSummary from './summary';
import InvestmentsTable from './table';

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Investimentos" />
			<DataContextProvider name="investments">
				<div className="w-full overflow-x-auto p-4 pt-3">
					<InvestmentsSummary />
					<InvestmentsTable />
				</div>
			</DataContextProvider>
		</>
	);
}
