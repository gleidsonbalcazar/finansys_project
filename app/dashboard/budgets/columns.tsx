'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, Pencil, Trash2, X } from 'lucide-react';
import DataTableColumnHeader from 'components/table/data-table-column-header';
import { Button } from 'components/ui/button';
import { formatCurrency } from 'lib/formatter';

export type Budget = {
	id: string;
	name: string;
};

export const columns: ColumnDef<Budget>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
		cell: (props) => {
			const { row } = props;
			const name = row.getValue<string>('name');
			return <div className="font-medium">{name}</div>;
		},
	},
	{
		accessorKey: 'typeLaunch',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
		cell: (props) => {
			const { row } = props;
			return <div className="font-medium">{row.getValue<string>('typeLaunch') == 'income'? 'Receita': 'Despesa'}</div>;
		},
	},
	{
		accessorKey: 'value',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Valor" />,
		cell: (props) => {
			const {
				row,
				table: { options },
			} = props;
			const user = options.meta?.user;
			const value = parseFloat(row.getValue('value'));
			const formatted = formatCurrency({ value: value, currency: user?.currency, locale: user?.locale });
			return <div className="font-medium tabular-nums">{formatted}</div>;
		},
	},
	{
		accessorKey: 'isDefault',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Padrão" />,
		cell: (props) => {
			const { row } = props;
			const isDefault = row.getValue<string>('isDefault');
			return <div className="font-medium">{isDefault ? (<CheckIcon />) : <X />}</div>;
		},
	},
	{
		accessorKey: 'actions',
		enableHiding: true,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Ações" />,
		cell: (props) => {
			const {
				row,
				table: {
					options: { meta },
				},
			} = props;
			return (
				<div className="flex">
					<Button className="mr-1 rounded-lg p-0 hover:bg-transparent hover:opacity-70" variant={'ghost'}>
						<Pencil
							className="h-4 w-4"
							onClick={() => {
								meta?.onEdit(row.original);
							}}
						/>
					</Button>
					<Button className="ml-2 rounded-lg p-0 hover:bg-transparent hover:opacity-70" variant={'ghost'}>
						<Trash2
							className="h-4 w-4"
							onClick={() => {
								meta?.onDelete(row.original?.id);
							}}
						/>
					</Button>
				</div>
			);
		},
		meta: {
			isTogglable: false,
		},
	},
];
