'use client';

// Error components must be Client Components
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('ERROR:', error);
	}, [error]);

	return (
		<div>
			<h2>Algo esta errado!</h2>
			<button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Tente novamente
			</button>
		</div>
	);
}
