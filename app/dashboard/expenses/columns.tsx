'use client';

import { ColumnDef, RowData } from '@tanstack/react-table';
import { CheckIcon, CornerDownRight, Pencil, Trash2, X } from 'lucide-react';

import DataTableColumnHeader from 'components/table/data-table-column-header';
import { Button } from 'components/ui/button';

import { formatCurrency, formatDate } from 'lib/formatter';

export type Expenses = {
	name: string;
	value: string;
	date: string;
	user_id: number;
	account_id: number;
	budget_id: number;
	id: string | null;
	actions: string;
};

declare module '@tanstack/table-core' {
	interface ColumnMeta<TData extends RowData, TValue> {
		isTogglable: boolean;
	}
}

export const columns: ColumnDef<Expenses>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
		cell: ({ row }) => {
			return (
				<div className="font-medium">
					{row.getValue('name')}
				</div>
			);
		},
	},
	{
		accessorKey: 'budget',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Orçamento" />,
		cell: ({ row }) => {
			const budget:any = row.getValue('budget');
			return (
				<div className="font-medium">
					{budget.name}
				</div>
			);
		},
	},
	{
		accessorKey: 'accounts',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Conta" />,
		cell: ({ row }) => {
			const account:any = row.getValue('accounts');
			return (
				<div className="font-medium">
					{account.name}
				</div>
			);
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
		accessorKey: 'date',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Data da Despesa" />,
		cell: (props) => {
			const {
				row,
				table: { options },
			} = props;
			const date = row.getValue<string>('date');
			const dateStyle = { day: 'numeric', month: '2-digit', year: 'numeric' };
			const formatted = formatDate({ date, locale: 'pt-BR', dateStyle: dateStyle });
			return <div className="">{formatted}</div>;
		},
	},
	{
		accessorKey: 'executed',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Executada" />,
		cell: (props) => {
			const {
				row,
				table: { options },
			} = props;
			const executed = row.getValue<string>('executed');
			return <div className="font-medium">{executed ? (<CheckIcon />) : <X />}</div>;
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
			const executed = row.getValue<string>('executed');
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
					{ !executed && (
					<Button className="ml-2 rounded-lg p-0 hover:bg-transparent hover:opacity-70" variant={'ghost'}>
						<CornerDownRight
							className="h-4 w-4"
							onClick={() => {
								if(meta?.onExecute) meta?.onExecute(row.original?.id);
							}}
						/>
					</Button> ) }
				</div>
			);
		},
		meta: {
			isTogglable: false,
		},
	},
];
