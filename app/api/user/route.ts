import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { checkAuth } from 'lib/auth';
import { Database } from 'lib/database.types';
import prisma from 'lib/prisma';

import messages from 'constants/messages';
import { qUsers } from './queries/qUsers';

const supabaseAdmin = createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
	process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
	{ auth: { persistSession: false } }
);

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const option = searchParams.get('option') || '';

	return await checkAuth(async (user: any) => {
		try {
			if(option != 'all') {
				const data = await prisma.users.findUnique({
					where: { id: user.id },
					select: {
						id: true,
						currency: true,
						locale: true,
						email: true,
						name: true,
						family: true,
						isMainFamily: true,
						defaultTheme: true,
						isUserAdmin: true
					},
				});
				return NextResponse.json({ ...data}, { status: 200 });
		} else {
			const query = qUsers(user);
			const data = await prisma.users.findMany({
				where: query,
				orderBy: { updated_at: 'desc' },
				select: {
					id:true,
					email: true,
					name:true,
					currency: true,
					locale: true,
					family: true,
					isMainFamily: true,
					defaultTheme: true,
					isUserAdmin: true
				},
			});
			return NextResponse.json(data, { status: 200 });
		}
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}

export async function PATCH(request: NextRequest) {
	const { id, currency, locale, email, name, family_id, isMainFamily, isUserAdmin,  defaultTheme} = await request.json();
	return await checkAuth(async (user: any) => {
		try {

			let userID = !id ? user.id: id;
			let data = { name, currency, locale,email, family_id: family_id, isMainFamily, isUserAdmin, defaultTheme };
			await prisma.users.update({ data: data, where: { id: userID } });

			const { error } = await supabaseAdmin.auth.admin.updateUserById(userID, { email })
			if (error) {
				return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
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
			let userID = !id ? user.id: undefined;
			await prisma.users.delete({ where: { id: userID } });
			const { error } = await supabaseAdmin.auth.admin.deleteUser(userID);
			if (error) {
				return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
			}
			return NextResponse.json('Deleted');
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	});
}
