import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import SimpleHeader from '@/components/simple-header';
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

export default function LocaleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full dark">
			<body className={`${inter.className} h-full bg-[#121316]`}>
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
										<SimpleHeader locale="en" />
										<main className="flex-1 flex overflow-hidden">
											<ResizablePanel>{children}</ResizablePanel>
										</main>
									</div>
								</ChatProvider>
							</ReplicaProvider>
						</SidebarProvider>
					</HeaderProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
