import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from 'lib/auth';
import prisma from 'lib/prisma';
import { Database } from 'lib/database.types';
import { createClient } from '@supabase/supabase-js';
import messages from 'constants/messages';

const supabaseAdmin = createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
	process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
	{ auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
	const { name, email, currency, locale, password, isMainFamily, isUserAdmin } = await request.json();
	return await checkAuth(async (user: any) => {
		try {
			let dataCreateToAuth = { email, password, email_confirm: true, user_metadata: { name: 'name' }};
			const { data, error } = await supabaseAdmin.auth.admin.createUser(dataCreateToAuth);
			if (error) {
				return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
			}
			await prisma.users.create({
				data: { id: data.user.id, name, email, currency, locale, isMainFamily, isUserAdmin },
			});
			return NextResponse.json('added', { status: 201 });
		} catch (error) {
			return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
		}
	}, false);
}
