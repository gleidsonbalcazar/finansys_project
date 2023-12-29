import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';

import messages from 'constants/messages';

export async function POST(request: NextRequest) {
	const { name } = await request.json();
	return await checkAuth(async (user: any) => {
		try {
			await prisma.family.create({
				data: { name },
			});
			return NextResponse.json('family added', { status: 201 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	}, false);
}
