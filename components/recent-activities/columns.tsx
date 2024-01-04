'use client';

import { ColumnDef } from '@tanstack/react-table';

import { formatCurrency, formatDate } from 'lib/formatter';

export type recentActivities = {
	no: string;
	name: string;
	data: string;
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
		accessorKey: 'data',
		header: 'Data',
		cell: (props) => {
			const {
				row,
				table: { options },
			} = props;
			const date = row.getValue<string>('data');
			const dateStyle = { day: 'numeric', month: '2-digit', year: 'numeric' };
			const formatted = formatDate({ date, locale: 'pt-BR', dateStyle: dateStyle });
			return <div className="">{formatted}</div>;
		},
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
