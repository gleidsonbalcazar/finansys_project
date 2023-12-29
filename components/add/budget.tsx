'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { addBudget, editBudget } from 'app/dashboard/budgets/apis';
import debounce from 'debounce';
import useSWR from 'swr';

import { useUser } from 'components/context/auth-provider';
import CircleLoader from 'components/loader/circle';
import Modal from 'components/modal';
import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { useToast } from 'components/ui/use-toast';

import { apiUrls } from 'lib/apiUrls';
import { getCurrencySymbol } from 'lib/formatter';

import messages from 'constants/messages';
import { Combobox } from 'components/combobox';

interface AddBudget {
	show: boolean;
	selected: any;
	onHide: () => void;
	mutate: () => void;
	lookup: (name: string) => void;
}

const initialState = {
	name: '',
	family_id: '',
	isDefault: false,
	value: 0,
	typeLaunch: 'expense',
};

interface familyInterface {
	id: string;
	name: string;
}

export default function AddBudget({ show, onHide, mutate, selected, lookup }: AddBudget) {
	const [state, setState] = useState<any>(initialState);
	const [loading, setLoading] = useState(false);
	const user = useUser();
	const { toast } = useToast();
	const inputRef = useRef<any>(null);
	const { data: familyInterface = [] } = useSWR(apiUrls.family.getFamily());

	const data = {
		family: familyInterface,
	};

	const familyData = Object.keys(data.family)
	.map((key) => { return { label: data.family[key].name, value: data.family[key].id }; });

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
			setLoading(true);
			const isEditing = selected?.id;
			if (isEditing) {
				await editBudget(state);
			} else {
				await addBudget(state);
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
		<Modal someRef={inputRef} show={show} title={`${selected.id ? 'Editar' : 'Adicionar'} Orçamento`} onHide={onHide}>
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
						<RadioGroup defaultValue="expense" className="flex flex-row space-y-1"
						value={state.typeLaunch}
						onValueChange={(v:any): void => {
							setState({ ...state, typeLaunch: v });
						}}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="income" id="incomes"/>
								<Label htmlFor="incomes">Receitas</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="expense" id="expense" />
								<Label htmlFor="expense">Despesas</Label>
							</div>
						</RadioGroup>
					</div>
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
							autoComplete="off"
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
					<div className="mr-3">
						<Label htmlFor="value">
							Valor
							<span className="ml-2 font-mono text-xs text-muted-foreground">
								({getCurrencySymbol(user.currency, user.locale)})
							</span>
						</Label>
						<Input
							className="mt-1.5"
							id="value"
							type="number"
							placeholder="199.99"
							min="0"
							required
							step="any"
							onChange={(event) => setState({ ...state, value: event.target.value.toString() })}
							value={state.value.toString()}
						/>
					</div>
					<div className="mr-3">
						<Label htmlFor="family">Família</Label>
						<Combobox
							data={familyData}
							selected={state.family_id}
							onChange={(value:any) => {
								setState({...state, family_id: +value });
							}} />

					</div>
					<div className="mr-3">
						<Checkbox
							onCheckedChange={(checked: boolean) => {
								setState({ ...state, isDefault: checked });
							}}
							checked={state.isDefault}
							className="mr-3 p-0 hover:bg-transparent hover:opacity-70"
						/>
						<Label htmlFor="userAdmin">Padrão</Label>
					</div>
					<Button disabled={loading} className="mt-2" type="submit">
						{loading ? <CircleLoader /> : `${selected?.id ? 'Atualizar' : 'Gravar'}`}
					</Button>
				</form>
			</div>
		</Modal>
	);
}
