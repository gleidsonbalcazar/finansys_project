'use client';

import SummaryCard from 'components/card/summary-card';
import { useUser } from 'components/context/auth-provider';
import { useData } from 'components/context/data-provider';
import CardLoader from 'components/loader/card';

export default function InvestmentsSummary() {
	const user = useUser();
	const { data = [], loading = true } = useData();
	return (
		<>
			<h2 className="mb-4 font-semibold text-primary dark:text-white">Visão Geral</h2>
			{loading ? (
				<CardLoader cards={2} className="mb-6" />
			) : (
				<div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
					<SummaryCard
						title="Somas dos Investimentos"
						value={data.reduce((acc: any, datum: any) => Number(datum.value) + acc, 0)}
					/>
					{/* <SummaryCard title="top spent category" data={formatCurrency({ value: 1 })} /> */}
				</div>
			)}
		</>
	);
}
