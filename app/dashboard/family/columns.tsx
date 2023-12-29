'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import DataTableColumnHeader from 'components/table/data-table-column-header';
import { Button } from 'components/ui/button';

export type Family = {
	id: string;
	name: string;
};

export const columns: ColumnDef<Family>[] = [
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
