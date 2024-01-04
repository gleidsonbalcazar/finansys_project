'use client';

import { useMemo } from 'react';

import Charts from 'app/dashboard/charts';
import { BadgeMinusIcon, BadgePlusIcon, LandmarkIcon, Wallet2Icon } from 'lucide-react';

import BalanceCard from 'components/card/balance-card';
import CardWithProgressBar from 'components/card/card-with-progressbar';
import { useOverview } from 'components/context/overview-provider';
import ChartLoader from 'components/loader/chart';

import { extractActualView } from 'lib/extractor';

import { TypeSummaryEnum } from 'constants/type-summary.enum';

interface ActualViewInterface {
	incomesExecuted: number;
	incomesTarget: number;
	incomesNotPlanned: number;
	remainingIncomesTotal: number;
	expensesExecuted: number;
	expensesTarget: number;
	expensesNotPlanned: number;
	remainingExpensesTotal: number;
	investmentsExecuted: number;
	investmentsTarget: number;
	investmentsNotPlanned: number;
	remainingInvesmentsTotal: number;
}

export default function ActualView() {
	const { data, loading } = useOverview();
	const infoData = useMemo<ActualViewInterface>(
		() => extractActualView(data.expenses, data.budgets, data.income, data.investments),
		[data.expenses, data.budgets, data.income, data.investments]
	);

	if (loading) {
		return <ChartLoader className="mb-10 h-[230px] pl-0 pt-0" type="actualView" />;
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
				<CardWithProgressBar
					title="Receitas"
					valueActual={infoData.incomesExecuted}
					valueTarget={infoData.incomesTarget}
					valueNotPlanned={infoData.incomesNotPlanned}
					valueRemaining={infoData.remainingIncomesTotal}
					icon={BadgePlusIcon}
					type={TypeSummaryEnum.Income}
				/>
				<CardWithProgressBar
					title="Despesas"
					valueActual={infoData.expensesExecuted}
					valueTarget={infoData.expensesTarget}
					valueNotPlanned={infoData.expensesNotPlanned}
					valueRemaining={infoData.remainingExpensesTotal}
					icon={BadgeMinusIcon}
					type={TypeSummaryEnum.Expense}
				/>
				<CardWithProgressBar
					title="Investimentos"
					valueActual={infoData.investmentsExecuted}
					valueTarget={infoData.investmentsTarget}
					valueNotPlanned={infoData.investmentsNotPlanned}
					valueRemaining={infoData.remainingInvesmentsTotal}
					icon={Wallet2Icon}
					type={TypeSummaryEnum.Investments}
				/>
				<BalanceCard title="Saldo nas Contas" accounts={data.accounts} icon={LandmarkIcon} />

				<Charts />
			</div>

		</>
	);
}
