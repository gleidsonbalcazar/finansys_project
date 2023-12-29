import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';
import messages from 'constants/messages';
import { qFamilies } from './queries/qFamillies';

export async function GET(request: NextRequest) {
	return await checkAuth(async (user: any) => {
		try {
			const data = await prisma.family.findMany({
				where: qFamilies(user),
				orderBy: { updated_at: 'desc' },
				select: {
					id:true,
					name:true
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
			await prisma.family.delete({
				where: { id: id[0] },
			});
			return NextResponse.json('deleted', { status: 200 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}

export async function PUT(request: NextRequest) {
	const { id, name } = await request.json();

	return await checkAuth(async () => {
		if (!id) {
			return NextResponse.json(messages.request.invalid, { status: 400 });
		}
		try {
			await prisma.family.update({
				data: { name },
				where: { id },
			});
			return NextResponse.json('updated', { status: 200 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}
