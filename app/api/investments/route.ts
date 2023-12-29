import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';

import messages from 'constants/messages';
import { qInvestments } from './queries/qInvestments';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const from = searchParams.get('from') || '';
	const to = searchParams.get('to') || '';

	return await checkAuth(async (user: any) => {
		try {
			const query = qInvestments(user, to, from);
			const data = await prisma.investments.findMany({
				where: query,
				orderBy: { updated_at: 'desc' },
				select: {
					name: true,
					value: true,
					executed: true,
					account_id: true,
					accounts: {
						select: {
							id: true,
							name: true
						}
					},
					id: true,
					date: true,
					created_at: true,
					updated_at: true,
				},
			});
			return NextResponse.json(data.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	return await checkAuth(async (user: any) => {
		if (!id.length) {
			return NextResponse.json(messages.request.invalid, { status: 400 });
		}
		try {
			await prisma.investments.delete({
				where: { id: id[0] },
			});
			return NextResponse.json('deleted', { status: 200 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}

export async function PUT(request: NextRequest) {
	const { name, value, account_id, date, id, executed} = await request.json();

	return await checkAuth(async () => {
		if (!id) {
			return NextResponse.json(messages.request.invalid, { status: 400 });
		}
		try {
			await prisma.investments.update({
				data: { name, value, account_id, date, executed},
				where: { id },
			});
			return NextResponse.json('updated', { status: 200 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}
