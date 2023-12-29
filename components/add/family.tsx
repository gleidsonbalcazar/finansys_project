'use client';


import { useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'debounce';

import CircleLoader from 'components/loader/circle';
import Modal from 'components/modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useToast } from 'components/ui/use-toast';


import messages from 'constants/messages';
import { addFamily, editFamily } from 'app/dashboard/family/apis';

const checkUrl = (urlString: string) => {
	let url;
	try {
		url = new URL(urlString);
	} catch (_) {
		return false;
	}
	return url.protocol === 'http:' || url.protocol === 'https:';
};

interface AddFamily {
	show: boolean;
	selected: any;
	onHide: () => void;
	mutate: () => void;
	lookup: (name: string) => void;
}


const initialState = {
	name: '',
};

export default function AddFamily({ show, onHide, mutate, selected, lookup }: AddFamily) {
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
			setLoading(true);
			const isEditing = selected?.id;
			if (isEditing) {
				await editFamily(state);
			} else {
				await addFamily(state);
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
		<Modal someRef={inputRef} show={show} title={`${selected.id ? 'Edit' : 'Add'} Family`} onHide={onHide}>
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
									setState({ ...state, name: value });
									if (value.length > 2) onLookup(value);
								} else {
									setState({ ...state, name: ''});
								}
							}}
							value={state.name}
						/>
					</div>
					<Button disabled={loading} className="mt-2" type="submit">
								{loading ? <CircleLoader /> : `${selected?.id ? 'Atualizar' : 'Gravar'}`}
					</Button>
				</form>
			</div>
		</Modal>
	);
}
