'use client';

import { ColumnDef } from '@tanstack/react-table';

import { formatCurrency } from 'lib/formatter';

export type recentActivities = {
	no: string;
	name: string;
	amount: string;
	budget: string;
};

export const columns: ColumnDef<recentActivities>[] = [
	{
		accessorKey: 'no',
		header: 'No',
	},
	{
		accessorKey: 'name',
		header: 'Nome',
	},
	{
		accessorKey: 'budget',
		header: 'Tipo/Orçamento',
	},
	{
		accessorKey: 'amount',
		header: 'Total',
		cell: (props) => {
			const {
				row,
				table: { options },
			} = props;
			const user = options.meta?.user;
			const price = parseFloat(row.getValue('amount'));
			const formatted = formatCurrency({ value: price, currency: user?.currency, locale: user?.locale });
			return <div className="tabular-nums font-medium">{formatted}</div>;
		},
	},
];
