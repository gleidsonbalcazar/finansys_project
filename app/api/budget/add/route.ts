import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';

import messages from 'constants/messages';

export async function POST(request: NextRequest) {
	const { name, isDefault, family_id, typeLaunch, value } = await request.json();
	return await checkAuth(async (user: any) => {
		try {
			let data = { name, isDefault, family_id, typeLaunch: typeLaunch, value: value.toString() };
			await prisma.budget.create({
				data: data,
			});
			return NextResponse.json('budget added', { status: 201 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	}, false);
}
