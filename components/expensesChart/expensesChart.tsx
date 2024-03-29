'use client';

import { useMemo } from 'react';
import { BarChart } from '@tremor/react';
import { useUser } from 'components/context/auth-provider';
import { useOverview } from 'components/context/overview-provider';
import ChartLoader from 'components/loader/chart';
import { extractBudgets, extractChartAxis, extractValues } from 'lib/extractor';
import { formatCurrency } from 'lib/formatter';

export default function ExpensesChart() {
	const user = useUser();
	const { data, loading } = useOverview();
	const chartData = useMemo<Array<any>>(
		() => extractValues(data.expenses, user.locale),
		[data.expenses, user.locale]
	);
	const budgetsData = useMemo<Array<string>>(() => extractBudgets(data.expenses), [data.expenses]);
	const [maxXAxisValue] = useMemo<Array<any>>(() => extractChartAxis(data.expenses), [data.expenses]);

	if (loading) {
		return <ChartLoader className="h-[340px]" type="bar" />;
	}

	if (!chartData.length) {
		return <p className="flex h-80 items-center justify-center text-sm">Nenhuma informação</p>;
	}

	return (
		<BarChart
			className="-mt-4 h-96"
			data={chartData}
			index="date"
			categories={budgetsData}
			valueFormatter={(value) => {
				return formatCurrency({ value, currency: user.currency, locale: user.locale });
			}}
			yAxisWidth={84}
			maxValue={maxXAxisValue?.value}
			showTooltip
			showLegend
			showGridLines
			stack
		/>
	);
}
