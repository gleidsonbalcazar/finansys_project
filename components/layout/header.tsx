'use client';

import { useSidebar } from 'components/context/sidebar-provider';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DatePicker from '../datepicker';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from 'components/context/auth-provider';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const MenuIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
		className="m-auto h-6 w-6 text-black dark:text-white"
	>
		<title>Abrir Menu</title>
		<path
			fillRule="evenodd"
			d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
			clipRule="evenodd"
		></path>
	</svg>
);

export default function LayoutHeader({ title, showDatePicker = false }: { title: string; showDatePicker?: boolean }) {
	const supabase = createClientComponentClient();
	const router = useRouter();
	const user = useUser();
	const { show, setShow } = useSidebar();

	async function signOut() {
		await supabase.auth.signOut();
		window.location.href = '/signin';
	}

	return (
		<>
			<div
				className={`flex justify-between p-3 pl-4 pr-4 text-gray-950 dark:text-gray-200 ${
					showDatePicker ? 'flex-col sm:flex-row' : 'flex-row items-center'
				}`}
			>
				<div className="flex">
					<Button className="mr-2 mt-[-1px] p-1 sm:hidden" onClick={() => setShow(!show)} variant={'ghost'}>
						<MenuIcon />
					</Button>
					<h2
						className={`text-2xl font-extrabold capitalize leading-snug tracking-tight ${
							showDatePicker ? 'mb-2 sm:mb-0' : ''
						}`}
					>
						{title}
					</h2>
				</div>
				<div className="flex items-center justify-between sm:mt-0">
					{showDatePicker ? (
						<div className="date-picker mr-0 flex w-full items-center sm:mr-4">
							{/* <span className="mr-2 hidden text-xs font-semibold uppercase md:inline-block">Showing:</span> */}
							<DatePicker />
						</div>
					) : null}

				</div>
				<div className="flex items-center justify-center sm:mt-0 text-sm text-gray-950 dark:text-gray-200">
						<Menu as="div" className="relative inline-block text-left">
					<div>
						<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300">
							{ user.name }
							<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-950 dark:text-gray-200" aria-hidden="true" />
						</Menu.Button>
					</div>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="absolute right-0 bg-popover mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 text-gray-950 dark:text-gray-200 ring-black ring-opacity-5 focus:outline-none z-0">
							<div className="py-1">
							<Menu.Item>
										{() => (
											<button
												type="button"
												onClick={() => { router.push('/settings');}}
												className='text-gray-950 dark:text-gray-200  block w-full px-4 py-2 text-left text-sm hover:bg-accent focus:bg-accent'
											>
												Configurações
											</button>
										)}
									</Menu.Item>
									<hr />
									<Menu.Item>
										{() => (
											<button
												type="button"
												onClick={() => signOut()}
												className='text-gray-950 dark:text-gray-200  block w-full px-4 py-2 text-left text-sm hover:bg-accent focus:bg-accent'
											>
												Sair
											</button>
										)}
									</Menu.Item>
							</div>
						</Menu.Items>
					</Transition>
				</Menu>
				</div>
			</div>
			<Separator />
		</>
	);
}
