'use client';

import { useCallback, useState } from 'react';

import Add from 'components/add-button';
import { useUser } from 'components/context/auth-provider';
import { useData } from 'components/context/data-provider';
import DataTable from 'components/table/data-table';
import { useToast } from 'components/ui/use-toast';
import { lookup } from 'lib/lookup';
import messages from 'constants/messages';
import { UserData, deleteUser } from './apis';
import { columns } from './columns';

export default function UserTable() {
	const [selected, setSelected] = useState({});
	const { data, loading, filter, mutate } = useData();
	const user = useUser();
	const { toast } = useToast();

	const onDelete = useCallback(
		async (id: string) => {
			try {
				await deleteUser(id);
				toast({ description: messages.deleted, variant: 'success' });
				mutate();
			} catch {
				toast({ description: messages.error, variant: 'destructive' });
			}
		},
		[mutate, toast]
	);


	const onEdit = useCallback(async (data: UserData | any) => {
		setSelected(data);
	}, []);

	const onHide = useCallback(() => {
		setSelected({});
	}, []);

	const onLookup = useCallback((name: string) => lookup({ data, name, }), [data]);

	return (
		<>
			<DataTable
				options={{ user, onDelete, onEdit }}
				filter={filter}
				hideViewOptions={true}
				columns={columns}
				data={data}
				loading={loading}
				filename="Users"
			/>
			{ user.isUserAdmin || user.isMainFamily ? (<Add onHide={onHide} onLookup={onLookup} selected={selected} mutate={mutate} type="user" />) : ""}
		</>
	);
}
