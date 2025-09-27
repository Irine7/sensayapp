import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import ChatProvider from '@/components/chat-provider';
import ReplicaProvider from '@/components/replica-provider';
import ResizablePanel from '@/components/resizable-panel';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Sensay dApp',
	description: 'AI-powered application with Sensay API',
	icons: {
		icon: '/favicon.ico',
	},
};

import { HeaderProvider } from '@/components/header-context';
import { SidebarProvider } from '@/components/sidebar-context';

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const messages = await getMessages();

	return (
		<html lang={locale} className="h-full dark">
			<body className={`${inter.className} h-full bg-[#121316]`}>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem={false}
						disableTransitionOnChange
					>
						<HeaderProvider>
							<SidebarProvider>
								<ReplicaProvider>
									<ChatProvider>
										<div className="flex flex-col h-full">
											<Header />
											<main className="flex-1 flex overflow-hidden">
												<ResizablePanel>{children}</ResizablePanel>
											</main>
										</div>
									</ChatProvider>
								</ReplicaProvider>
							</SidebarProvider>
						</HeaderProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
				{/* <Script 
					src="https://chat-widget.sensay.io/b4d138ab-41ad-4830-b193-166db4d5b124/embed-script.js" 
					strategy="afterInteractive"
				/> */}
			</body>
		</html>
	);
}
