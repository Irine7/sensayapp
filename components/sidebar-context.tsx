'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarContextType {
	isAIChatVisible: boolean;
	toggleAIChat: () => void;
	setAIChatVisible: (visible: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isAIChatVisible, setIsAIChatVisible] = useState(false);

	const toggleAIChat = () => {
		setIsAIChatVisible((prev) => !prev);
	};

	const setAIChatVisible = (visible: boolean) => {
		setIsAIChatVisible(visible);
	};

	return (
		<SidebarContext.Provider
			value={{
				isAIChatVisible,
				toggleAIChat,
				setAIChatVisible,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const ctx = useContext(SidebarContext);
	if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
	return ctx;
}
