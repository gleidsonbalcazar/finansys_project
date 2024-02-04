import { useUser } from 'components/context/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import ProgressBar from 'components/ui/progressBar';
import { formatCurrency } from 'lib/formatter';
import { TypeSummaryEnum } from 'constants/type-summary.enum';

type Summary = { title: String; valueActual: number; valueTarget?: number; valueNotPlanned?: number, valueRemaining?: number, icon?: any, type: TypeSummaryEnum};

export default function CardWithProgressBar({ title, valueActual = 0, valueTarget = 0, valueNotPlanned = 0, valueRemaining = 0, icon: Icon, type }: Summary) {
	const user = useUser();
	const valueActualformated = formatCurrency({ value: valueActual ?? 0, currency: user.currency, locale: user.locale });
	const valueTargetformated = formatCurrency({ value: valueTarget ?? 0, currency: user.currency, locale: user.locale });
	const valueRemainingformated = formatCurrency({ value: valueRemaining ?? 0, currency: user.currency, locale: user.locale });
	const valueNotPlannedformated = formatCurrency({ value: valueNotPlanned ?? 0, currency: user.currency, locale: user.locale });

	return (
		<Card className="relative" title={title.toString()}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xs font-semibold uppercase text-muted-foreground">{title}</CardTitle>
				{ Icon ? <Icon className="absolute right-3 h-4 w-4" /> : null }
			</CardHeader>
			<CardContent>
				<span
					title="Executados / Para Executar"
					className={`mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-extrabold tabular-nums text-foreground `}
				>
					{ type == TypeSummaryEnum.Income || TypeSummaryEnum.Expense || TypeSummaryEnum.Investments ? valueActualformated + ' / ' + valueTargetformated : valueActualformated}
					<ProgressBar valueActual={valueActual} valueTarget={valueTarget} type={type} />
					<div className="space-y-1 mt-6">
						<div className="flex items-center">
							<div className="ml-0">
								<p className="text-sm font-normal leading-none">Executado</p>
							</div>
							<div className="ml-auto font-normal text-base">{valueActualformated}</div>
						</div>
						<div className="flex items-center">
							<div className="ml-0">
								<p className="text-sm font-normal leading-none">Ainda por Executar</p>
							</div>
							<div className="ml-auto font-normal text-base">{valueRemainingformated}</div>
						</div>
						<div className="flex items-center">
							<div className="ml-0">
								<p className="text-sm font-normal leading-none">Executado e não Planejado</p>
							</div>
							<div className="ml-auto font-normal text-base">{valueNotPlannedformated}</div>
						</div>
						<div className="flex items-center">
							<div className="ml-0">
								<p className="text-sm font-normal leading-none">Planejado</p>
							</div>
							<div className="ml-auto font-normal text-base">{valueTargetformated}</div>
						</div>
					</div>
				</span>
			</CardContent>
		</Card>
	);
}
