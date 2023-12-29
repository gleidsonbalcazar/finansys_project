import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';

import messages from 'constants/messages';

export async function PUT(request: NextRequest) {
	const { id } = await request.json();

	return await checkAuth(async () => {
		if (!id) {
			return NextResponse.json(messages.request.invalid, { status: 400 });
		}
		try {
			let dataToUpdate = { executed: true };
			await prisma.income.update({
				data: dataToUpdate,
				where: { id },
			});
			return NextResponse.json('updated executed', { status: 200 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}
