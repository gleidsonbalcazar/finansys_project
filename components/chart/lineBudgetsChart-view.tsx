import { LineChart } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { extractProgressionBudgets } from 'lib/extractor';
import { useMemo } from 'react';
import useSWR from 'swr';
import { apiUrls } from 'lib/apiUrls';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import { useDate } from '../context/datepicker-provider';
import { dateFormat } from 'constants/date';

const chartdata4 = [
  {
    date: "Jan 23",
    Combustível: 167,
		Feira: 152
  },
  {
    date: "Feb 23",
    Combustível: 125,
		Feira: 15
  },
  {
    date: "Mar 23",
    Combustível: 156,
		Feira: 1
  },
];

const customTooltip = ({ payload, active }) => {
  if (!active || !payload) return null;
  return (
    <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
      {payload.map((category, idx) => (
        <div key={idx} className="flex flex-1 space-x-2.5">
          <div className={`w-1 flex flex-col bg-${category.color}-500 rounded`} />
          <div className="space-y-1">
            <p className="text-tremor-content">{category.dataKey}</p>
            <p className="font-medium text-tremor-content-emphasis">{category.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function LineBudgetsChartView()
{
	const { date } = useDate();
	date.from = startOfMonth(addMonths(new Date(),-3));
	date.end = endOfMonth(addMonths(new Date(),-1));

	const from = format(date.from || date.to, dateFormat);
	const to = format(date.to || date.from, dateFormat);
	const {
		data: expensesData = [],
		isLoading: isExpenseLoading,
		mutate: mutateExpenses,
	} = useSWR(apiUrls.expenses.getExpenses({ from, to }));
	const { data: incomeData = [], isLoading: isIncomeLoading, mutate: mutateIncomes } = useSWR(apiUrls.income.getIncome({ from, to }));
	const { data: budgetsData = [], isLoading: isBudgetLoading, mutate: mutateBudget } = useSWR(apiUrls.budget.getBudget({typeLaunch: "all"}));

	const data = {
		expenses: expensesData,
		income: incomeData,
		budgets: budgetsData,
		mutate: {
			mutateExpenses,
			mutateIncomes,
			mutateBudget,
		},
	};

	const chartData = useMemo<Array<any>>(() => extractProgressionBudgets(data.expenses, data.budgets, data.income), [data.expenses, data.budgets, data.income]);
	const budgets_ids = [28,14];
	//console.log(data.budgets);
	const categories = data.budgets.filter(f => budgets_ids.indexOf(f.id) != -1).map(m => m.name);
	console.log(categories);
	console.log(chartData);


	return (
		<>
			<Card className="relative">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Últimos 3 meses por Tipo de Orçamento</CardTitle>
				</CardHeader>
				<CardContent>
					<LineChart
						className="h-72 mt-4 "
						data={chartData}
						index="date"
						categories={categories}
						colors={["blue"]}
						yAxisWidth={30}
						customTooltip={customTooltip} />
				</CardContent>
			</Card>
		</>
	)
};
