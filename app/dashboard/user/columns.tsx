'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, Pencil, Trash2, X } from 'lucide-react';
import DataTableColumnHeader from 'components/table/data-table-column-header';
import { Button } from 'components/ui/button';
import { UserInterface } from './user.interface';

export const columns: ColumnDef<UserInterface>[] = [
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
		accessorKey: 'email',
		header: ({ column }) => <DataTableColumnHeader column={column} title="E-mail" />,
		cell: (props) => {
			const { row } = props;
			const email = row.getValue<string>('email');
			return <div className="font-medium">{email}</div>;
		},
	},
	{
		accessorKey: 'family',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Família" />,
		cell: ({ row }) => {
			const family = row.getValue<any>('family');
			return <div className="font-medium">{family.name}</div>;
		},
	},
	{
		accessorKey: 'currency',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Moeda" />,
		cell: (props) => {
			const { row } = props;
			const currency = row.getValue<string>('currency');
			return <div className="font-medium">{currency}</div>;
		},
	},
	{
		accessorKey: 'locale',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Região" />,
		cell: (props) => {
			const { row } = props;
			const locale = row.getValue<string>('locale');
			return <div className="font-medium">{locale}</div>;
		},
	},
	{
		accessorKey: 'isMainFamily',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Líder da Família" />,
		cell: (props) => {
			const { row } = props;
			const isMainFamily = row.getValue<string>('isMainFamily');
			return <div className="font-medium">{isMainFamily ? (<CheckIcon />) : <X />}</div>;
		},
	},
	{
		accessorKey: 'isUserAdmin',
		maxSize: 100,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Administrador do Sistema" />,
		cell: (props) => {
			const { row } = props;
			const isUserAdmin = row.getValue<string>('isUserAdmin');
			return <div className="text-center font-medium">{isUserAdmin ? (<CheckIcon />) : <X />}</div>;
		},

	},
	{
		accessorKey: 'actions',
		enableSorting: false,
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
