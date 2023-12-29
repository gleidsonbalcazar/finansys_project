import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';
import messages from 'constants/messages';


export async function POST(request: NextRequest) {
	const { name, description, active, user } = await request.json();
	return await checkAuth(async (userLogged: any) => {
		try {
			const createdAccount = await prisma.accounts.create({
				data: { name, description, active  },
			});

			if(createdAccount) {
				await prisma.userAccounts.create({ data : { user_id: user == null ? userLogged.id : user, account_id: createdAccount.id}})
			}

			return NextResponse.json('added', { status: 201 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	}, false);
}
