'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send } from 'lucide-react';
import { useChat } from '@/components/chat-provider';
import { useReplica } from '@/components/replica-provider';
import {
	generatePeopleListMessage,
	detectPeopleCategory,
	extractSearchKeywords,
} from '@/app/lib/utils/generatePeopleListTrigger';

export default function AITriggerDemo() {
	const [userQuery, setUserQuery] = useState('');
	const [aiResponse, setAiResponse] = useState('');
	const { addMessage } = useChat();
	const { replicas, selectReplicaByType } = useReplica();

	const handleQuery = () => {
		if (!userQuery.trim()) return;

		// Find Matchmaker replica
		const matchmakerReplica = replicas.find(
			(replica) =>
				replica.name.toLowerCase() === 'matchmaker' ||
				replica.type.toLowerCase() === 'matchmaker'
		);

		if (matchmakerReplica) {
			// Select Matchmaker replica
			selectReplicaByType('matchmaker');

			// Send message to Matchmaker replica
			addMessage(
				{
					role: 'user',
					content: userQuery,
				},
				matchmakerReplica.uuid
			);
		} else {
			// Fallback to demo mode if Matchmaker not found
			const category = detectPeopleCategory(userQuery);
			const keywords = extractSearchKeywords(userQuery);

			if (category) {
				const response = generatePeopleListMessage(
					category,
					keywords,
					`I found suitable people for your request. Here's the list of ${
						category === 'investors'
							? 'investors'
							: category === 'mentors'
							? 'mentors'
							: 'founders'
					}:`
				);
				setAiResponse(response);
			} else {
				setAiResponse(
					`I couldn't determine a specific category of people from your query "${userQuery}". Try to be more specific, for example: "find investors for pre-seed" or "show mentors in marketing".`
				);
			}
		}
	};

	return (
		<Card className="bg-gray-900/50 border-gray-800 max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Bot className="h-5 w-5" />
					AI Triggers Demo
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label className="text-sm text-gray-400">
						Enter query to send to Matchmaker replica:
					</label>
					<div className="flex gap-2">
						<Input
							value={userQuery}
							onChange={(e) => setUserQuery(e.target.value)}
							placeholder="For example: 'find investors for pre-seed startup'"
							className="bg-gray-800 border-gray-700 text-white"
						/>
						<Button
							onClick={handleQuery}
							className="bg-pink-500 hover:bg-pink-600"
						>
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{aiResponse && (
					<div className="space-y-2">
						<label className="text-sm text-gray-400">
							Demo response (if Matchmaker replica not available):
						</label>
						<div className="bg-gray-800 p-4 rounded-lg">
							<pre className="text-sm text-gray-300 whitespace-pre-wrap">
								{aiResponse}
							</pre>
						</div>
					</div>
				)}

				<div className="text-xs text-gray-500 space-y-1">
					<p>Example queries:</p>
					<ul className="ml-4 space-y-1">
						<li
							className="cursor-pointer hover:text-blue-400 transition-colors"
							onClick={() =>
								setUserQuery('find investors for pre-seed startup')
							}
						>
							"find investors for pre-seed startup"
						</li>
						<li
							className="cursor-pointer hover:text-blue-400 transition-colors"
							onClick={() => setUserQuery('show mentors in marketing')}
						>
							"show mentors in marketing"
						</li>
						<li
							className="cursor-pointer hover:text-blue-400 transition-colors"
							onClick={() => setUserQuery('looking for founders in fintech')}
						>
							"looking for founders in fintech"
						</li>
						<li
							className="cursor-pointer hover:text-blue-400 transition-colors"
							onClick={() => setUserQuery('early stage investors for SaaS')}
						>
							"early stage investors for SaaS"
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
