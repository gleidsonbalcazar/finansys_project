'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { addUser, editUser } from 'app/dashboard/user/apis';
import { format } from 'date-fns';
import debounce from 'debounce';
import useSWR from 'swr';

import { Combobox } from 'components/combobox';
import { useUser } from 'components/context/auth-provider';
import CircleLoader from 'components/loader/circle';
import Modal from 'components/modal';
import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useToast } from 'components/ui/use-toast';

import { apiUrls } from 'lib/apiUrls';

import { dateFormat } from 'constants/date';
import messages from 'constants/messages';

import data from 'data/currency.json';

interface AddUser {
	show: boolean;
	selected: any;
	onHide: () => void;
	mutate: () => void;
	lookup: (name: string) => void;
}

const todayDate = format(new Date(), dateFormat);

const initialState = {
	date: todayDate,
	name: '',
	email: '',
	currency: 'eur',
	locale: 'pt',
	isMainFamily: false,
	isUserAdmin: false,
};

const currencyData = Object.keys(data)
	.map((key: string) => {
		const { languages = [], currency } = data[key as keyof typeof data];
		const [currencyCode] = currency;
		if (!currencyCode) return false;
		return languages.map((language: any) => ({
			label: `${data[key as keyof typeof data].name} - ${language}`,
			value: `${currencyCode}-${language}`.toLowerCase(),
		}));
	})
	.filter(Boolean)
	.flat(Infinity);

export default function AddUser({ show, onHide, mutate, selected, lookup }: AddUser) {
	const user = useUser();
	const currency = `${user.currency}-${user.locale}`;
	const [state, setState] = useState<any>(initialState);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const inputRef = useRef<any>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => setState(selected.id ? selected : initialState), [selected]);

	const onLookup = useMemo(() => {
		const callbackHandler = (value: string) => {
			setState((prev: any) => ({ ...prev, autocomplete: lookup(value) }));
		};
		return debounce(callbackHandler, 500);
	}, [lookup]);

	const onSubmit = async () => {
		try {
			if (state.password != state.confirm_password) {
				toast({ description: "Passwords don't match", variant: 'destructive' });
				return;
			}
			setLoading(true);
			const isEditing = selected?.id;
			if (isEditing) {
				await editUser(state);
			} else {
				await addUser(state);
			}
			setLoading(false);
			toast({ description: `${isEditing ? messages.updated : messages.success}`, variant: 'success' });
			if (mutate) mutate();
			onHide();
			setState({ ...initialState });
		} catch {
			setLoading(false);
			toast({ description: messages.error, variant: 'destructive' });
		}
	};

	return (
		<Modal someRef={inputRef} show={show} title={`${selected.id ? 'Editar' : 'Adicionar'} Usuário`} onHide={onHide}>
			<div className="sm:flex sm:items-start">
				<form
					className="md:[420px] grid w-full grid-cols-1 items-center gap-3"
					onSubmit={(event) => {
						event.preventDefault();
						onSubmit();
						if (!selected.id) setState({ ...initialState });
					}}
				>
					<div className="relative">
						<Label htmlFor="name">Nome</Label>
						<Input
							className="mt-1.5"
							id="name"
							placeholder="Nome"
							maxLength={30}
							required
							ref={inputRef}
							autoFocus
							onChange={({ target }) => {
								const { value } = target;
								if (value.length) {
									setState({ ...state, name: value });
									if (value.length > 2) onLookup(value);
								} else {
									setState({ ...state, name: '' });
								}
							}}
							value={state.name}
						/>
					</div>
					<div className="relative">
						<Label htmlFor="email">E-mail</Label>
						<Input
							className="mt-1.5"
							id="email"
							placeholder="usuario@email.com"
							maxLength={30}
							required
							onChange={({ target }) => {
								const { value } = target;
								if (value.length) {
									setState({ ...state, email: value });
									if (value.length > 2) onLookup(value);
								} else {
									setState({ ...state, email: '' });
								}
							}}
							value={state.email}
						/>
					</div>
					<div className="mr-3">
						<Label className="mb-3 block" htmlFor="currency">
							Região/Moeda
						</Label>
						<Combobox
							data={currencyData}
							selected={currency}
							onChange={async (value: string) => {
								const [currency, locale] = value.split('-');
								setState({ ...state, currency: currency, locale: locale });
							}}
						/>
					</div>
					{!selected.id && (
						<div className="grid grid-cols-[50%,50%] gap-1">
							<div className="mr-3">
								<Label htmlFor="password">Senha</Label>
								<Input
									className="mt-1.5"
									id="password"
									maxLength={30}
									required
									type="password"
									autoComplete="off"
									onChange={({ target }) => {
										const { value } = target;
										if (value.length) {
											setState({ ...state, password: value });
											if (value.length > 2) onLookup(value);
										} else {
											setState({ ...state, password: '' });
										}
									}}
									value={state.password}
								/>
							</div>
							<div className="mr-3">
								<Label htmlFor="confirm_password">Confirmar Senha</Label>
								<Input
									className="mt-1.5"
									id="confirm_password"
									maxLength={30}
									type="password"
									required
									autoComplete="off"
									onChange={({ target }) => {
										const { value } = target;
										if (value.length) {
											setState({ ...state, confirm_password: value });
											if (value.length > 2) onLookup(value);
										} else {
											setState({ ...state, confirm_password: '' });
										}
									}}
								/>
							</div>
						</div>
					)}
					<div className="grid grid-cols-[50%,50%] gap-1 text-center mb-2 mt-2">
						<div className="mr-3">
							<Checkbox
								onCheckedChange={(checked: boolean) => {
									setState({ ...state, isUserAdmin: checked });
								}}
								checked={state.isUserAdmin}
								className="mr-3 p-0 hover:bg-transparent hover:opacity-70"
							/>
							<Label htmlFor="userAdmin">Administrador do Sistema</Label>
						</div>
						<div className="mr-3">
							<Checkbox
								onCheckedChange={(checked: boolean) => {
									setState({ ...state, isMainFamily: checked });
								}}
								checked={state.isMainFamily}
								className="mr-3 p-0 hover:bg-transparent hover:opacity-70"
							/>
							<Label htmlFor="mainFamily">Líder da Família</Label>
						</div>
					</div>
					<Button disabled={loading} className="mt-2" type="submit">
								{loading ? <CircleLoader /> : `${selected?.id ? 'Atualizar' : 'Gravar'}`}
					</Button>
				</form>
			</div>
		</Modal>
	);
}
