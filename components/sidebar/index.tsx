'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SvgWhiteLogo from 'public/icons/white-logo.svg';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSidebar } from 'components/context/sidebar-provider';
import {
	SignoutIcon,
} from 'components/icons';
import { Separator } from 'components/ui/separator';
import { cn } from 'lib/utils';
import shortcuts from 'constants/shortcuts';
import SidebarLink from './link';
import { BadgeMinusIcon, BadgePlusIcon, GanttChartIcon, LandmarkIcon, PersonStanding, PieChartIcon } from 'lucide-react';

const dashboardLinks = [
	{ name: 'Visão Geral', href: '/', Icon: PieChartIcon, shortcutText: shortcuts.menu.overview.shortcut },
	{ name: 'Receitas', href: '/income', Icon: BadgePlusIcon, shortcutText: shortcuts.menu.income.shortcut },
	{ name: 'Despesas', href: '/expenses', Icon: BadgeMinusIcon, shortcutText: shortcuts.menu.expenses.shortcut },
	{
		name: 'Orçamentos',
		href: '/budgets',
		Icon: GanttChartIcon,
		shortcutText: shortcuts.menu.budgets.shortcut,
	},
	{
		name: 'Contas',
		href: '/accounts',
		Icon: LandmarkIcon,
		shortcutText: shortcuts.menu.accounts.shortcut,
	},
	{
		name: 'Usuários',
		href: '/user',
		Icon: PersonStanding,
		shortcutText: shortcuts.menu.users.shortcut,
	},
];

const menuShortcutList = Object.values(shortcuts.menu).map((_) => _.shortcut);

export default function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = createClientComponentClient();
	const { show, setShow } = useSidebar();

	useHotkeys(menuShortcutList, (_, handler) => {
		const keys = handler.keys?.join('');
		if (keys === shortcuts.menu.overview.shortcut) router.push('/');
		if (keys === shortcuts.menu.income.shortcut) router.push('/income');
		if (keys === shortcuts.menu.expenses.shortcut) router.push('/expenses');
		if (keys === shortcuts.menu.users.shortcut) router.push('/user');
		if (keys === shortcuts.menu.accounts.shortcut) router.push('/accounts');
		if (keys === shortcuts.menu.budgets.shortcut) router.push('/budgets');
	});

	async function signOut() {
		await supabase.auth.signOut();
		window.location.href = '/signin';
	}

	return (
		<>
			<div
				onClick={() => setShow(false)}
				className={`fixed inset-0 left-0 right-0 z-[1] hidden bg-black bg-opacity-10 backdrop-blur ${cn({
					'!block': show,
				})}`}
			/>
			<nav
				className={`fixed bottom-0 left-0 top-0 z-[1] hidden min-h-full w-[70px] flex-col bg-[#09090b] px-3 py-2 transition-all sm:flex sm:w-[64px] sm:dark:border-r sm:dark:border-border ${cn(
					{ '!block': show }
				)}`}
			>
				<div className="z-[10] mb-[10px] flex h-full w-[100%] flex-col justify-between">
					<div className="flex h-full flex-col items-center justify-between">
						<div className="flex flex-col items-center">
							<Link
								onClick={() => setShow(false)}
								href="/"
								className="mt-[3px] active:scale-95 rounded-lg p-1 transition-all focus:outline-none"
							>
								<Image className="block" src={SvgWhiteLogo} width={30} height={30} alt="" />
							</Link>
							<Separator className="mb-2 mt-[8px] border-t border-gray-100 opacity-[0.2]" />
							{dashboardLinks.map((link, index) => {
								return (
									<SidebarLink
										className={index === 0 ? '!mt-0' : ''}
										onClick={() => setShow(false)}
										key={link.name}
										name={link.name}
										active={pathname === link.href}
										href={link.href}
										shortcut={link.shortcutText}
									>
										<link.Icon className="text-white" />
									</SidebarLink>
								);
							})}
						</div>
						<div className="flex flex-col items-center">

							<button
								className={`mt-2 flex h-[40px] w-full items-center justify-center rounded-lg p-2 text-base tracking-wide text-white hover:bg-[#27272a]`}
								onClick={signOut}
								title="Sair"
							>
								<div className="flex items-center">
									<SignoutIcon className="text-white" />
								</div>
							</button>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
}
