'use client';

import { useCallback, useMemo } from 'react';

import { useOverview } from 'components/context/overview-provider';
import { DataTable } from 'components/recent-activities/data-table';

import { extractRecentData } from 'lib/extractor';

import { columns } from './columns';
import { useUser } from 'components/context/auth-provider';

const initialData = {
	no: '',
	budget: '',
	amount: '',
	data: '',
	name: '',
};

export default function RecentActivitiesTable() {
	const { data, loading } = useOverview();
	const user = useUser();

	const onDelete = useCallback(() => {
	}, []);

	const onEdit = useCallback(() => {
	}, []);

	const recentData = useMemo(
		() => extractRecentData(data.expenses, data.income),
		[data]
	);

	if (loading) {
		return (
			<DataTable
				options={{ user, onDelete, onEdit }}
				data={[initialData, initialData, initialData, initialData, initialData]}
				loading={loading}
				columns={columns}
			/>
		);
	}

	if (!recentData.length) {
		return <p className="flex h-64 items-center justify-center text-sm">Nenhuma informação</p>;
	}

	return (
		<DataTable
			options={{ user, onDelete, onEdit }}
			columns={columns}
			data={recentData.map((datum, index) => ({
				no: `${index + 1}.`,
				budget: datum.budget.name,
				amount: datum.value,
				data: datum.created_at,
				name: datum.name,
			}))}
		/>
	);
}
