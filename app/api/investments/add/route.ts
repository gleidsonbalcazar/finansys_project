import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';

import messages from 'constants/messages';

export async function POST(request: NextRequest) {
	const { name, value, account_id, date, executed } = await request.json();
	return await checkAuth(async (user: any) => {
		try {
			const dataToAdd = { name, value, account_id, date, user_id: user.id, executed };
			await prisma.investments.create({
				data: dataToAdd,
			});
			return NextResponse.json('added', { status: 201 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	}, false);
}
