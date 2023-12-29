'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import CircleLoader from 'components/loader/circle';
import { Button } from 'components/ui/button';
import url from 'constants/url';

const initialState = { loading: false, email: '', password: '', success: false, error: '' };

export default function SignInForm() {
	const [state, setState] = useState(initialState);
	const inputElement = useRef<HTMLInputElement>(null);
	const supabase = createClientComponentClient();
	const router = useRouter();

	useEffect(() => {
		async function getUser() {
			const { data } = await supabase.auth.getUser();
			const { user } = data;
			if (user) {
				router.push(url.app.overview);
			}
		}

		getUser();
	}, [router, supabase.auth]);

	const handleSignIn = async () => {
		try {
			setState((prev) => ({ ...prev, loading: true, error: '', success: false }));
			const { data, error} = await supabase.auth.signInWithPassword({
				email: state.email,
				password: state.password,
			});

			if(error) {
				setState((prev) => ({ ...prev, error: error.message, loading: false }));
				return;
			}

			if(data){
				setState((prev) => ({ ...prev, success: true, loading: true }));
				router.push(url.app.overview);
			}

		} catch(error:any){
			setState((prev) => ({ ...prev, error: error.message, loading: false }));
		}
	};

	return (

		<form
			className="grid w-full grid-cols-1 items-center gap-4 text-gray-800"
			onSubmit={(event) => {
				event.preventDefault();
				handleSignIn();
			}}
		>
			<label className="mb-1 block">

				<span className="mb-2 block text-sm font-semibold leading-6">Email</span>
				<input
					className="mt-2 block h-10 w-full appearance-none rounded-md bg-white px-3 text-sm text-black shadow-sm ring-1 ring-gray-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
					autoFocus
					type="email"
					placeholder="usuario@email.com"
					required
					value={state.email}
					onChange={(event) => {
						setState({ ...state, email: event.target.value });
					}}
					ref={inputElement}
				/>
				{ state.error ?
				 <span className="inline-flex text-sm text-red-600">As credenciais não coincidem ou não existem</span> : "" }
			</label>
			<label className="mb-1 block">
				<span className="mb-2 block text-sm font-semibold leading-6">Senha</span>
				<input
					className="mt-2 block h-10 w-full appearance-none rounded-md bg-white px-3 text-sm text-black shadow-sm ring-1 ring-gray-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
					type="password"
					placeholder="Sua Senha"
					required
					value={state.password}
					onChange={(event) => {
						setState({ ...state, password: event.target.value });
					}}
					ref={inputElement}
				/>
			</label>
			<Button size={'lg'} type="submit" disabled={state.loading}>
				{state.loading ? <CircleLoader /> : 'Enviar'}
			</Button>
		</form>
	);
}
