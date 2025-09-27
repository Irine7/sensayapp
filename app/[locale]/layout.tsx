import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import SimpleHeader from '@/components/simple-header';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SidebarProvider } from '@/components/sidebar-context';
import { HeaderProvider } from '@/components/header-context';
import ReplicaProvider from '@/components/replica-provider';
import ChatProvider from '@/components/chat-provider';
import ResizablePanel from '@/components/resizable-panel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Evoo',
	description: 'AI-powered application with Sensay API',
	icons: {
		icon: '/favicon.ico',
	},
};

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
											<SimpleHeader locale={locale} />
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
			</body>
		</html>
	);
}
