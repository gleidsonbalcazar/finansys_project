'use client';

import { useCallback, useState } from 'react';

import Add from 'components/add-button';
import { useUser } from 'components/context/auth-provider';
import { useData } from 'components/context/data-provider';
import DataTable from 'components/table/data-table';
import { useToast } from 'components/ui/use-toast';
import { lookup } from 'lib/lookup';
import messages from 'constants/messages';
import { ExpenseData, deleteExpense, executeExpense } from './apis';
import { columns } from './columns';


export default function ExpenseTable() {
	const [selected, setSelected] = useState({});
	const { data, loading, filter, mutate } = useData();
	const uniqueBudgetsSet  = new Set(data?.map((expense: { budget: any; }) => JSON.stringify(expense.budget)));
	const uniqueBudgets: any[] = Array.from(uniqueBudgetsSet).map((jsonString: any) => JSON.parse(jsonString)).map((bud: any) => ({
		label: bud.name,
		value: bud.name
	}));
	const uniqueAccountsSet  = new Set(data?.map((expense: { accounts: any; }) => JSON.stringify(expense.accounts)));
	const uniqueAccounts: any[] = Array.from(uniqueAccountsSet).map((jsonString: any) => JSON.parse(jsonString)).map((bud: any) => ({
		label: bud.name,
		value: bud.name
	}));

	const user = useUser();
	const { toast } = useToast();

	const onDelete = useCallback(
		async (id: string) => {
			try {
				await deleteExpense(id);
				toast({ description: messages.deleted, variant: 'success' });
				mutate();
			} catch {
				toast({ description: messages.error, variant: 'destructive' });
			}
		},
		[mutate, toast]
	);

	const onExecute = useCallback(async (id: string) => {
		try {
      await executeExpense(id);
      toast({ description: messages.executed, variant:'success' });
      mutate();
    } catch {
      toast({ description: messages.error, variant: 'destructive' });
    }
	}, [mutate, toast]);

	const onEdit = useCallback(async (data: ExpenseData | any) => {
		setSelected(data);
	}, []);

	const onHide = useCallback(() => {
		setSelected({});
	}, []);

	const onLookup = useCallback((name: string) => lookup({ data, name }), [data]);

	return (
		<>
			<DataTable
				options={{ user, onDelete, onEdit, onExecute }}
				filter={filter}
				columns={columns}
				budgets={uniqueBudgets}
				accounts={uniqueAccounts}
				data={data}
				loading={loading}
				filename="despesas"
			/>
			<Add onHide={onHide} onLookup={onLookup} selected={selected} mutate={mutate} type="expenses" />
		</>
	);
}
