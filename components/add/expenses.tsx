'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { addExpense, editExpense } from 'app/dashboard/expenses/apis';
import { format } from 'date-fns';
import debounce from 'debounce';
import useSWR from 'swr';

import AutoCompleteList from 'components/autocomplete-list';
import { useUser } from 'components/context/auth-provider';
import CircleLoader from 'components/loader/circle';
import Modal from 'components/modal';
import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useToast } from 'components/ui/use-toast';

import { apiUrls } from 'lib/apiUrls';
import { getCurrencySymbol } from 'lib/formatter';

import { dateFormat, datePattern } from 'constants/date';
import messages from 'constants/messages';
import { Combobox } from 'components/combobox';

interface AddExpenseProps {
	show: boolean;
	selected: any;
	onHide: () => void;
	mutate: () => void;
	lookup: (value: any) => void;
}
const todayDate = format(new Date(), dateFormat);

const initialState = {
	name: '',
	value: '',
	budget_id: '',
	account_id: '',
	date: todayDate,
	executed: true,
	autocomplete: [],
};

interface BudgetInterface {
	id: string;
	name: string;
}

interface AccountInterface {
	id: string;
	name: string;
}

export default function AddExpense({ show, onHide, mutate, selected, lookup }: AddExpenseProps) {
	const user = useUser();
	const [state, setState] = useState<any>(initialState);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const inputRef = useRef<any>(null);
	const typeLaunch = "expense";

	const { data: BudgetInterface = [] } = useSWR(apiUrls.budget.getBudget({ typeLaunch }));
	const { data: AccountInterface = [] } = useSWR(apiUrls.accounts.getAccounts());

	const data = {
		budget: BudgetInterface,
		account: AccountInterface,
	};

	const budgetData = Object.keys(data.budget)
	.map((key) => { return { label: data.budget[key].name, value: data.budget[key].id }; });

	const accountsData = Object.keys(data.account)
	.map((key) => { return { label: data.account[key].name, value: data.account[key].id }; });

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
				await editExpense(state);
			} else {
				await addExpense(state);
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
		<Modal someRef={inputRef} show={show} title={`${selected.id ? 'Editar' : 'Adicionar'} Despesa`} onHide={onHide}>
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
							autoComplete="off"
							onChange={({ target }) => {
								const { value } = target;
								if (value.length) {
									setState({ ...state, name: value, autocomplete: [] });
									if (value.length > 2) onLookup(value);
								} else {
									setState({ ...state, name: '' });
								}
							}}
							value={state.name}
						/>
						<AutoCompleteList
							onHide={() => {
								setState({ ...state, autocomplete: [] });
							}}
							data={state.autocomplete}
							searchTerm={state.name.length > 2 ? state.name.toLowerCase() : ''}
							onClick={({ name }) => {
								setState({ ...state, name, autocomplete: [] });
							}}
							show={Boolean(state.autocomplete?.length)}
						/>
					</div>
					<div className="grid grid-cols-[50%,50%] gap-3">
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
								placeholder="199"
								required
								min="0"
								step="any"
								onChange={(event) => setState({ ...state, value: event.target.value.toString() })}
								value={state.value}
							/>
						</div>
						<div className="mr-3">
							<Label htmlFor="date">Data da Despesa</Label>
							<Input
								className="mt-1.5 appearance-none"
								id="date"
								type="date"
								required
								pattern={datePattern}
								onChange={(event) => {
									setState({ ...state, date: event.target.value });
								}}
								value={state.date}
							/>
						</div>
					</div>
					<div className="mr-3">
						<Label htmlFor="budget">Orçamento</Label>
						<Combobox
							data={budgetData}
							selected={state.budget_id}
							onChange={(value:any) => {
								setState({...state, budget_id: +value });
							}} />
					</div>
					<div className="mr-3">
						<Label htmlFor="budget">Conta</Label>
						<Combobox
							data={accountsData}
							selected={state.account_id}
							onChange={(value:any) => {
								setState({...state, account_id: +value });
							}} />
					</div>
					<div className="mr-3">
						<Checkbox
							onCheckedChange={(checked: boolean) => {
								setState({ ...state, executed: checked });
							}}
							checked={state.executed}
							className="mr-3 p-0 hover:bg-transparent hover:opacity-70"
						/>
						<Label htmlFor="executed">Executado</Label>
					</div>
					<Button disabled={loading} className="mt-1.5" type="submit">
								{loading ? <CircleLoader /> : `${selected?.id ? 'Atualizar' : 'Gravar'}`}
					</Button>
				</form>
			</div>
		</Modal>
	);
}
