import { useUser } from 'components/context/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';

import { formatCurrency } from 'lib/formatter';

export default function LastLaunchCard({ title, value, info }: any) {
	const user = useUser();
	const valueformated = formatCurrency({ value: value, currency: user.currency, locale: user.locale });

	return (
		<Card className="relative">
			<CardHeader className="pb-0">
				<CardTitle className="text-xs font-semibold uppercase text-muted-foreground">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<span
					title={valueformated}
					className={`mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-extrabold tabular-nums text-foreground`}
				>
					{valueformated}
				</span>
				<span
					className={`mt-1 ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm tabular-nums text-foreground`}
				>
					( {info} )
				</span>
			</CardContent>
		</Card>
	);
}
