import {
	useMemo,
	useState,
} from 'react';

import { LineChart } from '@tremor/react';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import useSWR from 'swr';

import { useUser } from 'components/context/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Label } from 'components/ui/label';
import { MultiSelect } from 'components/ui/multiSelect';

import { apiUrls } from 'lib/apiUrls';
import { extractProgressionBudgets } from 'lib/extractor';
import { formatCurrency } from 'lib/formatter';

import { dateFormat } from 'constants/date';

const customTooltip = ({ payload, active }) => {
	if (!active || !payload) return null;
	return (
		<div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
			{payload.map(
				(category,idx) => (
					<div key={idx} className="flex flex-1 space-x-2.5">
						<div className={`w-1 flex flex-col bg-${category.color}-500 rounded`} />
						<div className="space-y-1">
							<p className="text-tremor-content">{category.dataKey}</p>
							<p className="font-medium text-tremor-content-emphasis">{category.value}</p>
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default function LineBudgetsChartView({ budgets }) {
	let dateFrom = startOfMonth(addMonths(new Date(), -3));
	let dateEnd = endOfMonth(new Date());
	const user = useUser();
	const from = format(dateFrom || dateEnd, dateFormat);
	const to = format(dateEnd || dateFrom, dateFormat);
	const {
		data: expensesData = [],
		isLoading: isExpenseLoading,
		mutate: mutateExpenses,
	} = useSWR(apiUrls.expenses.getExpenses({ from, to }));
	const {
		data: incomeData = [],
		isLoading: isIncomeLoading,
		mutate: mutateIncomes,
	} = useSWR(apiUrls.income.getIncome({ from, to }));

	const budgetData = Object.keys(budgets).map((key) => {
		return { label: budgets[key].name, value: budgets[key].id };
	});

	budgetData.sort((a,b) => a.label.localeCompare(b.label));

	const data = {
		expenses: expensesData,
		income: incomeData,
		budgets: budgets,
		mutate: {
			mutateExpenses,
			mutateIncomes,
		},
	};
	const [budgetSelected, setSelected] = useState<any[]>([]);
	let budgetsIds = budgetSelected.map(f => f.value);

	const chartData = useMemo<Array<any>>(
		() => extractProgressionBudgets(data.expenses, data.income, budgetsIds),
		[data.expenses, data.income, budgetsIds]
	);

	const categories = budgetSelected.map(m => m.label)

	const valueFormatter = function (value) {
		return formatCurrency({ value, currency: user.currency, locale: user.locale });
	};

	return (
		<>
			<Card className="relative">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
						Últimos 3 meses por Tipo de Orçamento
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mr-3">
						<Label htmlFor="budget">Orçamento</Label>
						<MultiSelect
							options={budgetData}
							selected={budgetSelected}
							onChange={(item:any) => {
								setSelected(item);
							}}
							className="w-[560px]"
						/>
					</div>
					<div className="mr-3">
						<LineChart
							className="h-72 mt-4 "
							data={chartData}
							index="date"
							categories={categories}
							yAxisWidth={60}
							showGridLines={true}
							colors={['blue', 'red', 'green', 'yellow']}
							noDataText="Não há informações para este filtro"
							customTooltip={customTooltip}
							valueFormatter={valueFormatter}
						/>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
