'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Skeleton } from 'components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	className?: string;
	options: { user: any; onDelete: (id: string) => void; onEdit: (data: any) => void; onChange?: (data: any) => void };
	loading?: boolean;
}

const TableLoadingCell = () => {
	return <Skeleton className="h-[20px] w-[60%] rounded-md pr-2" />;
};

export function DataTable<TData, TValue>({ columns, data, options, className, loading = false }: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		meta: options,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className={className}>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead className={cn({ 'border-b border-muted': loading })} key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								className={cn({ 'dark:border-muted': loading })}
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell className={cn({ 'not:last:border-b': loading }, 'py-3.5')} key={cell.id}>
										{loading ? <TableLoadingCell /> : flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="mt-6 h-24 text-center">
								Nenhuma informação
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
