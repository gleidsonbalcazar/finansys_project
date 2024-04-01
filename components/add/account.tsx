'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import debounce from 'debounce';

import CircleLoader from 'components/loader/circle';
import Modal from 'components/modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useToast } from 'components/ui/use-toast';
import data from 'data/currency.json';

import { dateFormat } from 'constants/date';
import messages from 'constants/messages';
import { addAccount, editAccount } from 'app/dashboard/accounts/apis';
import { Checkbox } from 'components/ui/checkbox';
import { apiUrls } from 'lib/apiUrls';
import useSWR from 'swr';
import { useUser } from 'components/context/auth-provider';
import { Combobox } from 'components/combobox';


interface AddAccount {
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
	description: '',
	user_id: '',
	isMainAccount: true,
	active: true
};

interface userInterface {
	id: string;
	name: string;
}

export default function AddAccount({ show, onHide, mutate, selected, lookup }: AddAccount) {
	const [state, setState] = useState<any>(initialState);
	const user = useUser();
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const inputRef = useRef<any>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const { data: userInterface = [] } = useSWR(apiUrls.user.getUsers());

	const data = {
		usersData: userInterface,
	};

	const usersData = Object.keys(data.usersData)
		.map((key) => { return { label: data.usersData[key].name, value: data.usersData[key].id }; });

	useEffect(() => setState(selected.id ? { ...selected, user_id: selected.userAccounts[0].user_id, isMainAccount: selected.userAccounts[0].isMainAccount } : initialState), [selected]);

	const onLookup = useMemo(() => {
		const callbackHandler = (value: string) => {
			setState((prev: any) => ({ ...prev, autocomplete: lookup(value) }));
		};
		return debounce(callbackHandler, 500);
	}, [lookup]);


	const onSubmit = async () => {
		try {
			setLoading(true);
			const isEditing = selected?.id;

			if (isEditing) {
				await editAccount(state);
			} else {
				await addAccount(state);
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
		<Modal someRef={inputRef} show={show} title={`${selected.id ? 'Editar' : 'Adicionar'} Conta`} onHide={onHide}>
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
								setState({ ...state, name: value });
							}}
							value={state.name}
						/>
					</div>
					<div className="relative">
						<Label htmlFor="description">Descrição</Label>
						<Input
							className="mt-1.5"
							id="description"
							placeholder="Descrição"
							maxLength={30}
							required
							onChange={({ target }) => {
								const { value } = target;
								setState({ ...state, description: value });
							}}
							value={state.description}
						/>
					</div>
					{user.isUserAdmin && (
						<div className="mr-3">
							<Label htmlFor="family">Usuário</Label>
							<Combobox
								data={usersData}
								selected={state.user_id}
								onChange={(value: any) => {
									setState({ ...state, user_id: value });
								}} />
						</div>)}
					<div className="mr-3">
						<Checkbox
							onCheckedChange={(checked: boolean) => {
								setState({ ...state, isMainAccount: checked });
							}}
							checked={state.isMainAccount}
							className="mr-3 p-0 hover:bg-transparent hover:opacity-70"
						/>
						<Label htmlFor="userAdmin">Conta Principal</Label>
					</div>
					<div className="mr-3">
						<Checkbox
							onCheckedChange={(checked: boolean) => {
								setState({ ...state, active: checked });
							}}
							checked={state.active}
							className="mr-3 p-0 hover:bg-transparent hover:opacity-70"
						/>
						<Label htmlFor="userAdmin">Ativa</Label>
					</div>
					<Button disabled={loading} className="mt-2" type="submit">
						{loading ? <CircleLoader /> : `${selected?.id ? 'Atualizar' : 'Gravar'}`}
					</Button>
				</form>
			</div>
		</Modal>
	);
}


