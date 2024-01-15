'use client';

import { useState } from 'react';

import { ColumnFiltersState, RowData, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { useUser } from 'components/context/auth-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';

import TableLoader from './data-table-loader';
import DataTableToolbar from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';


declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		user: any;
		onDelete: (id: any) => void;
		onEdit: (data: any) => void;
		onChange?: (data: any) => void;
		onExecute?: (data: any) => void;
	}
}

type DataTableProps = {
	data: Array<any>;
	columns: Array<any>;
	loading: boolean;
	filter: { name: string; setFilter: (filter: string) => void; onFilter: (budgets: any) => void };
	options: { user: any; onDelete: (id: string) => void; onEdit: (data: any) => void; onChange?: (data: any) => void; onExecute?: (data : any) => void};
	filename: string;
	hideViewOptions?: boolean | undefined;
	budgets?: {
		label: string;
		value: string;
	}[];
};

export default function DataTable<TData, TValue>(props: DataTableProps) {
	const { data, columns, loading, budgets, filter, options, filename, hideViewOptions } = props;
	const [rowSelection, setRowSelection] = useState({})
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const user = useUser();

	const table = useReactTable({
		data,
		columns,
		enableRowSelection: false,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		onColumnVisibilityChange: setColumnVisibility,
		state: { sorting, columnFilters, rowSelection, columnVisibility, pagination: {pageIndex: 0, pageSize: 20} },
		meta: options,
	});


	return (
		<div className="mb-8">
			<DataTableToolbar
				budgets={budgets}
				user={options.user}
				filename={filename}
				filter={filter}
				loading={loading}
				table={table}
				hideViewOptions={hideViewOptions}
			/>
			<div className="rounded-md border border-border">
				<Table>
					<TableHeader className="bg-muted">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead className="text-black dark:text-white" key={header.id}>
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
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{ cell.column.columnDef.enableHiding && !(user.isMainFamily || user.isUserAdmin)? (
												null
											) : flexRender(cell.column.columnDef.cell, cell.getContext()) }
											</TableCell>
									))}
								</TableRow>
							))
						) : loading && table.getRowModel().rows?.length === 0 ? (
							<TableLoader rows={5} columns={columns.length} />
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
								Nenhuma informação
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
