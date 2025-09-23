'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChat } from './chat-provider';
import { useState } from 'react';

export default function GameIntroduction() {
	const { addMessage } = useChat();
	const [isLoaded, setIsLoaded] = useState(true);

	const handleAskQuestion = (question: string) => {
		addMessage({ role: 'user', content: question });
	};

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold text-mafia-900 dark:text-mafia-300">
				Welcome to Sensay dApp
			</h1>
		</div>
	);
}
