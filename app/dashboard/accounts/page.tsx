import { DataContextProvider } from 'components/context/data-provider';
import LayoutHeader from 'components/layout/header';
import AccountTable from './table';

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Contas" />
			<DataContextProvider name="accounts">
				<div className="w-full overflow-x-auto p-4 pt-3">
					<AccountTable />
				</div>
			</DataContextProvider>
		</>
	);
}
