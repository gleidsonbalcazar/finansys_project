'use client';

import ExpensesChart from 'components/expensesChart/expensesChart';
import IncomesChart from 'components/incomesChart/incomesChart';
import RecentActivitiesTable from 'components/recent-activities/table';
import { Card, CardContent, CardHeader } from 'components/ui/card';

export default function Charts() {
	return (
		<>
			<div className="mr-4 flex min-h-full w-full flex-col">
				<Card className="h-full">
					<CardHeader>
						<h3 className="font-medium">Despesas</h3>
						<p className="relative top-[-4px] pb-2 text-sm font-normal text-muted-foreground">
							Total de Despesas para a data selecionada.
						</p>
					</CardHeader>
					<CardContent className="mt-4">
						<ExpensesChart />
					</CardContent>
				</Card>
			</div>
			<div className="mb-8 flex min-h-full w-full flex-col md:mb-0 md:mt-0">
				<Card className="h-full w-full">
					<CardHeader>
						<h3 className="font-medium">Receitas</h3>
						<p className="relative top-[-4px] pb-2 text-sm font-normal text-muted-foreground">
							Total estimado de receitas para a data selecionada.
						</p>
					</CardHeader>
					<CardContent className="mt-4">
						<IncomesChart />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
