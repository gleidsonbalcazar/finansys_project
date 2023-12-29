import { NextRequest, NextResponse } from 'next/server';



import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';



import messages from 'constants/messages';
import { qAccounts } from './queries/qAccounts';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const balance = searchParams.get('showBalance') || '';

	if (balance != '') {
		return await checkAuth(async (user: any) => {
			const accounts = await prisma.accounts.findMany({
				where: qAccounts(user),
				select: {
					id: true,
					name: true,
				},
			});

			const expenses = await prisma.expenses.findMany({
				where: {
					account_id: {
						in: accounts.map((account) => account.id),
					},
					executed: true,
				},
				select: {
					account_id: true,
					accounts: {
					select : {
						name: true
						}
					},
					value: true,
				},
			});

			const expensesWithAccountNames = expenses.map(expense => ({
				account_id: expense.account_id,
				account_name: expense.accounts?.name || "Conta inexistente",
				value: expense.value,
				type: 'expense'
			}));

			//console.log(expensesWithAccountNames)

			const incomes = await prisma.income.findMany({
				where: {
					account_id: {
						in: accounts.map((account) => account.id),
					},
					executed: true,
				},
				select: {
					account_id: true,
					accounts: {
					select : {
						name: true
						}
					},
					value: true,
				},
			});

			const incomesWithAccountNames = incomes.map(incomes => ({
				account_id: incomes.account_id,
				account_name: incomes.accounts?.name ||  "Conta inexistente",
				value: incomes.value,
				type: 'income'
			}));

			const allTransactions: any[] = [...expensesWithAccountNames, ...incomesWithAccountNames];

			const balances = Object.values(
				allTransactions.reduce<{ [accountId: string]: { id: string; name: string; balance: number } }>(
					(acc, transaction) => {
						const accountId = transaction.account_id.toString();

						if (!acc[accountId]) {
							acc[accountId] = {
								id: accountId,
								name: transaction.account_name || "Conta inexistente",
								balance: 0,
							};
						}

						const value = parseFloat(transaction.value);
						acc[accountId].balance += transaction.type === 'expense' ? -value : value;

						acc[accountId].balance = parseFloat(acc[accountId].balance.toFixed(2));

						return acc;
					},
					{}
				)
			);

			return NextResponse.json(balances, { status: 200 });
		});
	} else {
		return await checkAuth(async (user: any) => {
			try {
				const data = await prisma.accounts.findMany({
					where: qAccounts(user),
					orderBy: { updated_at: 'desc' },
					select: {
						id: true,
						name: true,
						active: true,
						userAccounts: {
							select: {
								id: true,
								user_id: true,
								users: {
									select: {
										name: true,
										family: {
											select: {
												name: true,
											},
										},
									},
								},
							},
						},
						description: true,
					},
				});
				return NextResponse.json(data, { status: 200 });
			} catch (error) {
				return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
			}
		});
	}
}

export async function PATCH(request: NextRequest) {
	const { id, name, description, active, user_id, userAccounts } = await request.json();
	return await checkAuth(async (userLogged: any) => {
		try {
			await prisma.accounts.update({ data: { name, description, active }, where: { id } });

			if(user_id != null) {
				await prisma.userAccounts.update({ data: { user_id }, where: {id: userAccounts[0].id} });
			}

		  return NextResponse.json('Updated');
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	return await checkAuth(async (user: any) => {
		try {
			await prisma.accounts.delete({ where: { id } });
			return NextResponse.json('Deleted');
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}
