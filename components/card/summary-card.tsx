import { useUser } from 'components/context/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { TypeSummaryEnum } from 'constants/type-summary.enum';
import { formatCurrency } from 'lib/formatter';

type Summary = { title: String; value: any; value2?: any; icon?: any; tooltip?: string; info?: any , typeSummary?: TypeSummaryEnum};

export default function SummaryCard({ title, value, value2, icon: Icon, tooltip = '', info: Info, typeSummary }: Summary) {
	const user = useUser();
	const IconWithTooltip = () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Icon className="absolute right-3 top-1 h-4 w-4" />
			</TooltipTrigger>
			<TooltipContent className="normal-case" side="bottom">
				{tooltip}
			</TooltipContent>
		</Tooltip>
	);

	const valueformated = formatCurrency({ value: value, currency: user.currency, locale: user.locale });
	const value2formated = formatCurrency({ value: value2, currency: user.currency, locale: user.locale });

	return (
		<Card className="relative">
			<CardHeader className="pb-0">
				<CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
					{title}
					{Info ? <Info /> : null}
				</CardTitle>
				{Icon && tooltip ? <IconWithTooltip /> : Icon ? <Icon className="absolute right-3 top-1 h-4 w-4" /> : null}
			</CardHeader>
			<CardContent>
				<span
					title={valueformated}
					className={`mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-extrabold tabular-nums text-foreground`}
				>
					{valueformated} {value2formated && typeSummary != null ?  (
						 <span className='text-sm text-primary dark:text-white'>( { value2formated } )</span>
						) : ""}
				</span>
			</CardContent>
		</Card>
	);
}
