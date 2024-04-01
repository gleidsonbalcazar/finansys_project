'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, Pencil, Trash2, X } from 'lucide-react';
import DataTableColumnHeader from 'components/table/data-table-column-header';
import { Button } from 'components/ui/button';

export type Account = {
	id: string;
	name: string;
	description: string;
	userAccounts: UserAccounts[];
	active: boolean;
};

export type UserAccounts = {
	users: any;
}

export const columns: ColumnDef<Account>[] = [
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
		accessorKey: 'description',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Descrição" />,
		cell: (props) => {
			const { row } = props;
			const description = row.getValue<string>('description');
			return <div className="font-medium">{description}</div>;
		},
	},
	{
		accessorKey: 'userAccounts',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Usuário" />,
		cell: ({ row }) => {
			const userAccounts = row.getValue<any>('userAccounts');
			const user = userAccounts[0].users.name;
			return <div className="font-medium">{user}</div>;
		},
	},
	{
		accessorKey: 'userAccounts2',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Conta Principal" />,
		cell: ({ row }) => {
			const userAccounts = row.getValue<any>('userAccounts');
			const isMainAccount = userAccounts[0].isMainAccount;
			return <div className="font-medium">{isMainAccount ? (<CheckIcon />) : <X />}</div>;
		},
	},
	{
		accessorKey: 'active',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Ativo" />,
		cell: (props) => {
			const { row } = props;
			const active = row.getValue<string>('active');
			return <div className="font-medium">{active ? (<CheckIcon />) : <X />}</div>;
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
