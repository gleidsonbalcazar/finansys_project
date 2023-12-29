import { Inter } from 'next/font/google';

import './globals.css';
import './overwrites.css';

const inter = Inter({ subsets: ['latin'] });

export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" >
			<body className={`${inter.className} flex h-full flex-col text-gray-600 antialiased`}>{children}</body>
		</html>
	);
}
