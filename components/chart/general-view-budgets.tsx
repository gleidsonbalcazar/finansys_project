'use client';

import { useMemo } from 'react';

import { useUser } from 'components/context/auth-provider';
import { useOverview } from 'components/context/overview-provider';
import ChartLoader from 'components/loader/chart';
import { extractOverviewBybudgets } from 'lib/extractor';
import { formatCurrency } from 'lib/formatter';
import BarList from 'components/barlist/barList';
import { Card, CardContent, CardHeader } from 'components/ui/card';

export default function GeneralViewByBudgets() {
	const user = useUser();
	const { data, loading } = useOverview();
	const chartData = useMemo<Array<any>>(() => extractOverviewBybudgets(data.expenses, data.budgets, data.income), [data.expenses, data.budgets, data.income]);
	if (loading) {
		return <ChartLoader className="mb-10 h-[230px] pl-0 pt-0" type="barlist" />;
	}

	if (!chartData.length) {
		return <p className="flex h-64 items-center justify-center text-sm">Nenhuma informação</p>;
	}

	return (
		<>
			<Card className="h-auto w-full">
				<CardHeader></CardHeader>
				<CardContent>
					<BarList
						data={chartData}
						valueFormatter={(value: any) => {
							return formatCurrency({ value, currency: user.currency, locale: user.locale });
						}}
						showAnimation={true}
						className="mt-2"
						color="blue"
					/>
				</CardContent>
			</Card>
		</>
	);
}
