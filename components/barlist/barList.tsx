import React from 'react';

import { ValueFormatter } from '@tremor/react';
import { Info } from 'lucide-react';

import TableLoader from 'components/table/data-table-loader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'components/ui/tooltip';

import {
	Color,
	colorPalette,
	defaultValueFormatter,
	getColorClassNames,
	makeClassName,
	sizing,
	spacing,
	tremorTwMerge,
} from './lib';
import { extractTotalByTypeBudget } from 'lib/extractor';

const makeBarListClassName = makeClassName('BarList');

type Bar = {
	key?: string;
	valueBudget?: number;
	valueExecuted: number;
	valueNotExecuted?: number;
	name: string;
	icon?: React.JSXElementConstructor<any>;
	href?: string;
	target?: string;
	color?: Color;
};

const getWidthsFromValues = (dataValues: number[]) => {
	let maxValue = -Infinity;
	dataValues.forEach((value) => {
		maxValue = Math.max(maxValue, value);
	});

	return dataValues.map((value) => {
		if (value === 0) return 0;
		return Math.max((value / maxValue) * 100, 1);
	});
};

const getPercentualWidth = (valueExecuted: number, valueBudget: number) => {
	if (valueExecuted === 0) return 0;
	if (valueBudget === 0) {
		valueBudget = 101;
	}

	var result = Math.max((valueExecuted / valueBudget ?? 0) * 100, 1);

	if (result > 100) {
		return 101;
	}

	return result;
};

const getColorBar = (valueExecuted: number, valueBudget: number) => {
	var result = getPercentualWidth(valueExecuted, valueBudget);
	if (result > 80 && result <= 100) return 'bg-blue-500';
	if (result === 0) return 'bg-slate-50 bg-opacity-10';
	if (result > 100) return 'bg-gradient-to-r from-blue-600/50 to-red-500/100 ';
	return 'bg-blue-500';
};

export interface BarListProps extends React.HTMLAttributes<HTMLDivElement> {
	data: Bar[];
	valueFormatter?: ValueFormatter;
	color?: Color;
	showAnimation?: boolean;
}

const BarList = React.forwardRef<HTMLDivElement, BarListProps>((props, ref) => {
	const { data = [], color, valueFormatter = defaultValueFormatter, showAnimation = false } = props;
	const sumExecutedExpense = extractTotalByTypeBudget('expense', data, 'valueExecuted');
	const sumExecutedIncome = extractTotalByTypeBudget('income', data, 'valueExecuted');
	const sumNotExecutedExpense = extractTotalByTypeBudget('expense', data, 'valueNotExecuted');
	const sumNotExecutedIncome = extractTotalByTypeBudget('income', data, 'valueNotExecuted');
	const sumBudgetExpense = extractTotalByTypeBudget('expense', data, 'valueBudget');
	const sumBudgetIncome = extractTotalByTypeBudget('income', data, 'valueBudget');
	const rowHeight = sizing.threeXl.height;

	return (
		<Table>
			<TableHeader className="bg-muted text-tremor-content dark:text-dark-tremor-content">
				<TableRow key="budget_table_row">
					<TableHead key="budget" className="text-primary items-center">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
										<span className='flex items-center whitespace-break-spaces'>Nome do Orçamento 	<Info width={16} height={16} /></span>
								</TooltipTrigger>
								<TooltipContent>
									<p>Total de {data.length} orçamentos para este período.</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableHead>
					<TableHead key="budget_executed" className="text-right text-primary items-center">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className='flex items-center whitespace-break-spaces justify-end'>Executado 	<Info width={16} height={16} /></span>
								</TooltipTrigger>
								<TooltipContent>
									<p>Receita: {valueFormatter(sumExecutedIncome)}</p>
									<p>Despesa: {valueFormatter(sumExecutedExpense)}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableHead>
					<TableHead key="budget_notexecuted" className="text-right text-primary">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className='flex items-center whitespace-break-spaces justify-end'>Não Executado 	<Info width={16} height={16} /></span>
								</TooltipTrigger>
								<TooltipContent>
									<p>Receita: {valueFormatter(sumNotExecutedIncome)}</p>
									<p>Despesa: {valueFormatter(sumNotExecutedExpense)}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableHead>
					<TableHead key="budget_value" className="text-right text-primary">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className='flex items-center whitespace-break-spaces justify-end'>	Valor do Orçamento 	<Info width={16} height={16} /></span>
								</TooltipTrigger>
								<TooltipContent>
									<p>Receita: {valueFormatter(sumBudgetIncome)}</p>
									<p>Despesa: {valueFormatter(sumBudgetExpense)}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.length ? (
					data.map((item, idx) => (
						<TableRow key={`budget_row_${item.name}`}>
							<TableCell
								key="{item.name}"
								className={tremorTwMerge(
									makeBarListClassName('bar'),
									'flex items-center rounded-tremor-small bg-opacity-60 mt-2',
									rowHeight,
									item.color || color
										? getColorClassNames(item.color ?? (color as Color), colorPalette.background).bgColor
										: 'bg-tremor-brand-subtle dark:bg-dark-tremor-brand-subtle dark:bg-opacity-60',
									getColorBar(item.valueExecuted, item.valueBudget ?? 0),
									idx === data.length - 1 ? spacing.none.marginBottom : spacing.sm.marginBottom
								)}
								style={{
									width: `${getPercentualWidth(item.valueExecuted, item.valueBudget ?? 0)}%`,
									transition: showAnimation ? 'all 1s' : '',
								}}
							>
								<p className={tremorTwMerge(makeBarListClassName('barText'), 'whitespace-nowrap')}>{item.name}</p>
							</TableCell>
							<TableCell key="{item.valueExecuted}" className="text-right whitespace-nowrap truncate">
								{valueFormatter(item.valueExecuted)}
							</TableCell>
							<TableCell key="{item.valueNotExecuted}" className="text-right whitespace-nowrap truncate">
								{valueFormatter(item.valueNotExecuted ?? 0)}
							</TableCell>
							<TableCell key="{item.valueBudget}" className="text-right whitespace-nowrap truncate">
								{valueFormatter(item.valueBudget ?? 0)}
							</TableCell>
						</TableRow>
					))
				) : data.length === 0 ? (
					<TableLoader rows={5} columns={4} />
				) : (
					<TableRow>
						<TableCell colSpan={data.length} className="h-24 text-center">
							Não há informação disponível
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
});

BarList.displayName = 'BarList';

export default BarList;
