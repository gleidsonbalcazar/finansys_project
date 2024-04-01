'use client';

import { BadgeMinusIcon, BadgePlusIcon, Banknote, MoveDownRight, MoveUpRight } from 'lucide-react';

import { useOverview } from 'components/context/overview-provider';
import CardLoader from 'components/loader/card';
import { Badge } from 'components/ui/badge';
import { cn } from 'lib/utils';
import SummaryCard from '../../components/card/summary-card';

import { TypeSummaryEnum } from 'constants/type-summary.enum';

const Info = ({ value }: { value: number }) => {
	const isUp = value > 0;
	const Icon = isUp ? MoveUpRight : MoveDownRight;
	return (
		<Badge
			variant="secondary"
			className={`absolute bg-transparent tabular-nums font-semibold bottom-[5px] right-[5px] h-[18px] px-1 text-[10px] text-muted-foreground ${cn(
				{
					'text-green-600': isUp,
					'text-red-600': !isUp,
				}
			)}`}
		>
			<Icon className="mr-[0.5] h-[0.65rem] w-[0.65rem]" />
			{value}%
		</Badge>
	);
};

export default function Summary() {
	const { data, loading } = useOverview();

	const totalExpensesExecuted = data.expenses.filter((a: { executed: boolean; }) => a.executed).reduce((acc: any, { value }: any) => Number(value) + acc, 0);
	const totalExpensesToExecute = data.expenses.filter((a: { executed: boolean; }) => !a.executed).reduce((acc: any, { value }: any) => Number(value) + acc, 0);

	const totalIncomeExecuted = data.income.filter((a: { executed: boolean; }) => a.executed).reduce((acc: any, { value }: any) => Number(value) + acc, 0);
	const totalIncomeToExecute = data.income.filter((a: { executed: boolean; }) => !a.executed).reduce((acc: any, { value }: any) => Number(value) + acc, 0);

	const budgetExpensesPlanned = data.budgets.filter((a: { isDefault: boolean, typeLaunch: any}) => a.isDefault && a.typeLaunch == "expense").reduce((acc: any, { value }: any) => Number(value) + acc, 0);
	const budgetIncomesPlanned = data.budgets.filter((a: { isDefault: boolean, typeLaunch: any}) => a.isDefault && a.typeLaunch == "income").reduce((acc: any, { value }: any) => Number(value) + acc, 0);

	const totalSpent = totalExpensesExecuted;
	const totalBalance = totalIncomeExecuted - totalSpent;

	return (
		<>
			<h2 className="pt-3 mb-4 font-semibold text-primary dark:text-white">Visão Geral</h2>
			{loading ? (
				<CardLoader cards={5} />
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
					<SummaryCard
						icon={BadgePlusIcon}
						title="Receitas Executadas / Não Executadas"
						value={ totalIncomeExecuted}
						value2={ totalIncomeToExecute}
						typeSummary={TypeSummaryEnum.Income}
					/>
					<SummaryCard
						icon={BadgeMinusIcon}
						title="Despesas Executadas / Não Executadas"
						value={totalExpensesExecuted}
						value2={totalExpensesToExecute}
						typeSummary={TypeSummaryEnum.Expense}
					/>
					<SummaryCard
						icon={Banknote}
						title="Total Gasto / Saldo atual"
						value={totalSpent}
						value2={totalBalance}
						typeSummary={TypeSummaryEnum.Balance}
					/>
					<SummaryCard
						icon={BadgePlusIcon}
						title="Receitas Planejadas"
						value={budgetIncomesPlanned}
					/>
						<SummaryCard
						icon={BadgeMinusIcon}
						title="Despesas Planejadas"
						value={budgetExpensesPlanned}
					/>
				</div>
			)}
		</>
	);
}
