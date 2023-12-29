import { DataContextProvider } from 'components/context/data-provider';
import LayoutHeader from 'components/layout/header';
import FamilyTable from './table';

const title = 'Family';
const description = 'Manage your family information';

export const metadata = {
	title,
	description,
};

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Famílias" />
			<DataContextProvider name="family">
				<div className="w-full overflow-x-auto p-4 pt-3">
					<FamilyTable />
				</div>
			</DataContextProvider>
		</>
	);
}
