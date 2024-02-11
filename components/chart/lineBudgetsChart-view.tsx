import { LineChart } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { extractProgressionBudgets } from 'lib/extractor';
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiUrls } from 'lib/apiUrls';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import { dateFormat } from 'constants/date';
import { Label } from "components/ui/label";
import { Combobox } from "components/combobox";
import { formatCurrency } from "lib/formatter";
import { useUser } from "components/context/auth-provider";

const customTooltip = ({ payload, active }) => {
  if (!active || !payload) return null;
  return (
    <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
      {payload.map((category: { color: any; dataKey: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; value: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, idx: Key | null | undefined) => (
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

export default function LineBudgetsChartView({budgets})
{
	let dateFrom = startOfMonth(addMonths(new Date(),-3));
	let dateEnd = endOfMonth(new Date());
	const user = useUser();
	const from = format(dateFrom || dateEnd, dateFormat);
	const to = format(dateEnd || dateFrom, dateFormat);
	const {
		data: expensesData = [],
		isLoading: isExpenseLoading,
		mutate: mutateExpenses,
	} = useSWR(apiUrls.expenses.getExpenses({ from, to }));
	const { data: incomeData = [], isLoading: isIncomeLoading, mutate: mutateIncomes } = useSWR(apiUrls.income.getIncome({ from, to }));

	const budgetData = Object.keys(budgets)
	.map((key) => { return { label: budgets[key].name, value: budgets[key].id }; });

	const data = {
		expenses: expensesData,
		income: incomeData,
		budgets: budgets,
		mutate: {
			mutateExpenses,
			mutateIncomes,
		},
	};

	const [budget, setBudget] = useState<any>();
	const chartData = useMemo<Array<any>>(() => extractProgressionBudgets(data.expenses, data.income, budget), [data.expenses, data.income, budget]);
	const categories = data.budgets.filter((f: { id: any; }) =>f.id == budget).map((m: { name: any; }) => m.name);

	const valueFormatter = function(value){
		return formatCurrency({ value, currency: user.currency, locale: user.locale })
	}

	return (
		<>
			<Card className="relative">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Últimos 3 meses por Tipo de Orçamento</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mr-3">
						<Label htmlFor="budget">Orçamento</Label>
						<Combobox
							data={budgetData}
							selected={budget}
							onChange={(value:any) => {
								setBudget(+value);
							}} />
					</div>
					<div className="mr-3">
					<LineChart
						className="h-72 mt-4 "
						data={chartData}
						index="date"
						categories={categories}
						colors={["blue"]}
						yAxisWidth={60}
						showGridLines={true}
						noDataText="Não há informações para este filtro"
						customTooltip={customTooltip}
						valueFormatter={valueFormatter}
						/>
					</div>
				</CardContent>
			</Card>
		</>
	)
};
