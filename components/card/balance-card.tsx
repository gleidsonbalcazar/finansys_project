import { useUser } from 'components/context/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { formatCurrency } from 'lib/formatter';
type Summary = { title: String; accounts: any[], icon?: any };

export default function BalanceCard({ title, accounts, icon: Icon }: Summary) {
	const user = useUser();
	let sumofBalance = accounts.reduce((sum, item) => sum.balance + item.balance)
	return (
		<Card className="relative" title={title.toString()}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xs font-semibold uppercase text-muted-foreground">{title}</CardTitle>
				{Icon ? <Icon className="absolute right-3 h-4 w-4" /> : null}
			</CardHeader>
			<CardContent>
				<span
					title="Executados / Para Executar"
					className={`mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-extrabold tabular-nums text-foreground `}
				>
					<div className="space-y-1 mt-6">
						{accounts.length ? (
							accounts.map((item, idx) => (
								<div className="flex items-center" key={`account_row_${item.id}`}>
									<div className="ml-0">
										<p className="text-sm font-normal leading-none">{item.name}</p>
									</div>
									<div className={'ml-auto font-normal text-base ' + (Number(item.balance) < 0 ? 'text-red-500' : '')}>
										{formatCurrency({ value: item.balance ?? 0, currency: user.currency, locale: user.locale })}
									</div>
								</div>
							))) : ""
						}
					</div>
					{accounts.length ? (
						<><hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" /><div className="flex flex-row justify-end">
							<div className="space-y-1">
								Total: 	{formatCurrency({ value: sumofBalance ?? 0, currency: user.currency, locale: user.locale })}
							</div>
						</div></>) : ""}
				</span>
			</CardContent>
		</Card>
	);
}
