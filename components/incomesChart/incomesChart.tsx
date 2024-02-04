'use client';

import { useMemo } from 'react';
import { BarChart } from '@tremor/react';
import { useUser } from 'components/context/auth-provider';
import { useOverview } from 'components/context/overview-provider';
import ChartLoader from 'components/loader/chart';
import { extractBudgets, extractChartAxis, extractValues } from 'lib/extractor';
import { formatCurrency } from 'lib/formatter';


export default function IncomesChart() {
	const user = useUser();
	const { data, loading } = useOverview();
	const chartData = useMemo<Array<any>>(
		() => extractValues(data.income, user.locale),
		[data.income, user.locale]
	);
	const budgetsData = useMemo<Array<string>>(() => extractBudgets(data.income), [data.income]);
	const [maxXAxisValue] = useMemo<Array<any>>(() => extractChartAxis(data.income), [data.income]);

	if (loading) {
		return <ChartLoader className="h-[340px]" type="bar" />;
	}

	if (!chartData.length) {
		return <p className="flex h-80 items-center justify-center text-sm">No data</p>;
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
