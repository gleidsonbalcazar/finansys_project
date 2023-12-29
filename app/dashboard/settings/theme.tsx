'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components/ui/dropdown-menu';
import { updateUser } from './apis';

export default function Theme() {
	const { setTheme } = useTheme();

	const onUpdateTheme = async (type:string) => {
		setTheme(type);
		await updateUser({defaultTheme: type});
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<h2 className="font-semibold text-primary dark:text-white">Aparência/Tema</h2>
			</CardHeader>
			<CardContent>
				<div className="relative flex justify-between">
					<p className="text-sm">Mude como o app para seu conforto.</p>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="mt-[-10px] shrink-0 rounded-xl" variant="outline" size="icon">
								<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span className="sr-only">Tema</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onUpdateTheme('light')}>Light / Branco</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onUpdateTheme('dark')}>Dark / Preto</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onUpdateTheme('system')}>System / Sistema</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>
		</Card>
	);
}
