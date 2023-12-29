'use client';

import { useCallback, useState } from 'react';
import Add from 'components/add-button';
import { useUser } from 'components/context/auth-provider';
import { useData } from 'components/context/data-provider';
import DataTable from 'components/table/data-table';
import { useToast } from 'components/ui/use-toast';
import { lookup } from 'lib/lookup';
import messages from 'constants/messages';
import { columns } from './columns';
import { FamilyData, deleteFamily } from './apis';

export default function FamilyTable() {
	const [selected, setSelected] = useState({});
	const { data, loading, filter, mutate } = useData();
	const user = useUser();
	const { toast } = useToast();

	const onDelete = useCallback(
		async (id: string) => {
			try {
				await deleteFamily(id);
				toast({ description: messages.deleted, variant: 'success' });
				mutate();
			} catch {
				toast({ description: messages.error, variant: 'destructive' });
			}
		},
		[mutate, toast]
	);

	const onEdit = useCallback(async (data: FamilyData | any) => {
		setSelected(data);
	}, []);

	const onHide = useCallback(() => {
		setSelected({});
	}, []);

	const onLookup = useCallback((name: string) => lookup({ data, name }), [data]);

	return (

		<>
			<DataTable
				options={{ user, onDelete, onEdit }}
				filter={filter}
				columns={columns}
				hideViewOptions={true}
				data={data}
				loading={loading}
				filename="familia"
			/>
			<Add onHide={onHide} onLookup={onLookup} selected={selected} mutate={mutate} type="family" />
		</>
	);
}
