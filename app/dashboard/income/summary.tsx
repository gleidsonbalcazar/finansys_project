'use client';

import LastLaunchCard from 'components/card/last-launch-card';
import SummaryCard from 'components/card/summary-card';
import { useData } from 'components/context/data-provider';
import CardLoader from 'components/loader/card';


export default function IncomeSummary() {
	const { data = [], loading = true } = useData();
	const sortedTransactions = data.sort(
		(a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	return (
		<>
			<h2 className="mb-4 font-semibold text-primary dark:text-white">Visão Geral</h2>
			{loading ? (
				<CardLoader cards={2} className="mb-6" />
			) : (
				<div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
						<SummaryCard
						title="Total Executadas"
						value={data.filter((f: { executed: any; }) => f.executed).reduce((acc: any, datum: any) => Number(datum.value) + acc, 0)}
					/>
						<SummaryCard
						title="Total ainda para Executadar"
						value={data.filter((f: { executed: any; }) => !f.executed).reduce((acc: any, datum: any) => Number(datum.value) + acc, 0)}
					/>
						<LastLaunchCard
						title="Último Lançamento"
						value={sortedTransactions[0]?.value}
						info={sortedTransactions[0]?.name}
					/>
				</div>
			)}
		</>
	);
}
