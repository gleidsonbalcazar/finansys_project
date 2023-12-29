import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

import messages from 'constants/messages';

import prisma from './prisma';

type UserData = {
	email: string;
	basic_usage_limit_email: boolean;
	premium_usage_limit_email: boolean;
	premium_plan_expired_email: boolean;
};


export const checkAuth = async (callback: Function, isGetMethod = true) => {
	const supabase = createServerActionClient({ cookies });
	const { data } = await supabase.auth.getSession();
	const { session } = data;

	if (session && session.user) {
		const user = { ...await prisma.users.findUnique({ where: { id: session.user.id } }), ...session.user};
		return callback(user);
	} else {
		return NextResponse.json({ message: messages.account.unauthorized }, { status: 401 });
	}
};
