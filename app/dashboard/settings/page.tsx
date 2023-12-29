import LayoutHeader from 'components/layout/header';

import Account from './account';
import DeleteAccount from './delete-account';
import Theme from './theme';

export default async function Page() {
	return (
		<>
			<LayoutHeader title="Configurações" />
			<div className="mt-6 w-full overflow-x-auto p-4 pt-3">
				<div className="m-auto flex w-full max-w-2xl flex-col items-center space-y-6">
					<Account />
					<Theme />
					<DeleteAccount />
				</div>
			</div>
		</>
	);
}
