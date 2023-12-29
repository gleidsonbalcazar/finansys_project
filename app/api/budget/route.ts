import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';
import messages from 'constants/messages';
import { qBudgets } from './queries/qBudget';


export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const typeLaunch = searchParams.get('typeLaunch') || '';

	return await checkAuth(async (user: any) => {
		try {
			const data = await prisma.budget.findMany({
				where: qBudgets(user,typeLaunch),
				orderBy: { updated_at: 'desc' },
				select: {
					id:true,
					name:true,
					isDefault: true,
					family_id: true,
					value: true,
					typeLaunch: true,
					family: true,
				},
			});
			return NextResponse.json(data);
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
			await prisma.budget.delete({
				where: { id: id[0] },
			});
			return NextResponse.json('deleted', { status: 200 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}

export async function PUT(request: NextRequest) {
	const { id, name, isDefault, family_id, typeLaunch, value } = await request.json();

	return await checkAuth(async () => {
		if (!id) {
			return NextResponse.json(messages.request.invalid, { status: 400 });
		}
		try {
			await prisma.budget.update({
				data: { name, isDefault, family_id, typeLaunch: typeLaunch, value: value },
				where: { id },
			});
			return NextResponse.json('updated', { status: 200 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}

