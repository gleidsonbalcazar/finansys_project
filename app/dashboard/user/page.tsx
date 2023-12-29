import { DataContextProvider } from 'components/context/data-provider';
import LayoutHeader from 'components/layout/header';
import UserTable from './table';

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Usuários" />
			<DataContextProvider name="user">
				<div className="w-full overflow-x-auto p-4 pt-3">
					<UserTable />
				</div>
			</DataContextProvider>
		</>
	);
}
