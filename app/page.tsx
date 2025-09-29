'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useReplica } from '@/components/replica-provider';
import { useSidebar } from '@/components/sidebar-context';
import PeopleNamesDisplay from '@/components/people-names-display';
import PeopleNamesList from '@/components/people-names-list';
import PeopleListTrigger from '@/components/people-list-trigger';
import AITriggerDemo from '@/components/ai-trigger-demo';
import TestAnswerSection from '@/components/test-answer-section';

type ReplicaType = 'matchmaker' | 'mentor' | 'buddy';
type QuickAction = 'investors' | 'mentors' | 'founders';

interface MatchPerson {
	name: string;
	role: string;
	company: string;
	description: string;
	matchPercentage: number;
	isBestMatch?: boolean;
	location?: string;
	expertise?: string[];
}

interface MatchmakerResults {
	userInterest: string;
	matches: MatchPerson[];
	bestMatch: MatchPerson;
}

export default function Home() {
	const [selectedReplicaType, setSelectedReplicaType] =
		useState<ReplicaType | null>(null);
	const router = useRouter();
	const { selectReplicaByType } = useReplica();
	const { setAIChatVisible } = useSidebar();

	// State for matchmaker results (now local)
	const [matchmakerResults, setMatchmakerResults] =
		useState<MatchmakerResults | null>(null);
	const [isLoadingResults, setIsLoadingResults] = useState(false);

	const replicaTypes = [
		{
			id: 'matchmaker' as ReplicaType,
			name: 'Matchmaker',
			icon: '💕',
			description: 'Finds matches between participants and evaluates match %',
			color: 'from-pink-500 to-rose-600',
			borderColor: 'hover:border-pink-500/50',
		},
		{
			id: 'mentor' as ReplicaType,
			name: 'Mentor',
			icon: '🎯',
			description:
				'Provides advice on how to present your startup, who to approach, what to ask',
			color: 'from-blue-500 to-cyan-600',
			borderColor: 'hover:border-blue-500/50',
		},
		{
			id: 'buddy' as ReplicaType,
			name: 'Buddy',
			icon: '🤝',
			description:
				'Helps newcomers navigate conferences, suggests simple entry points',
			color: 'from-green-500 to-emerald-600',
			borderColor: 'hover:border-green-500/50',
		},
	];

	const quickActions = [
		{
			id: 'investors' as QuickAction,
			name: 'Find Investors',
			icon: '💰',
			description: 'Find investors suitable for your startup',
			color: 'from-yellow-500 to-amber-600',
		},
		{
			id: 'mentors' as QuickAction,
			name: 'Find Mentors',
			icon: '🧠',
			description: 'Find suitable experts and mentors',
			color: 'from-purple-500 to-violet-600',
		},
		{
			id: 'founders' as QuickAction,
			name: 'Find Fellow Founders',
			icon: '🚀',
			description: 'Find other founders for experience exchange',
			color: 'from-orange-500 to-red-600',
		},
	];

	const handleReplicaSelection = (replicaType: ReplicaType) => {
		setSelectedReplicaType(replicaType);

		// Select replica by type
		selectReplicaByType(replicaType);

		// Open sidebar with AI chat
		setAIChatVisible(true);

		console.log(`Selected replica type: ${replicaType}`);
	};

	const handleQuickAction = (action: QuickAction) => {
		if (!selectedReplicaType) return;

		// Navigate to the list of people in the corresponding category
		const query = `search ${action} for ${selectedReplicaType}`;
		router.push(`/people/${action}?q=${encodeURIComponent(query)}`);
	};
	return (
		<div className="min-h-screen bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-black/50 via-gray-900/30 to-black/50" />
				<div className="container mx-auto px-6 py-10 relative">
					<div className="text-center space-y-8 max-w-4xl mx-auto">
						<Badge
							variant="outline"
							className="mb-4 bg-primary/70 border-primary text-white"
						>
							AI-powered networking
						</Badge>

						<div className="flex justify-center">
							<Image
								src="/logo.png"
								alt="Evoo"
								width={400}
								height={120}
								className="h-24 md:h-32 w-auto"
							/>
						</div>

						<div className="max-w-2xl mx-auto">
							<Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700">
								<CardContent className="p-8">
									<div className="space-y-6">
										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
												<span className="text-white font-bold">1</span>
											</div>
											<div>
												<h3 className="text-lg text-left font-semibold text-white">
													Choose Assistant
												</h3>
												<p className="text-gray-400">
													Define its character and role (Matchmaker, Mentor or
													Buddy)
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
												<span className="text-white font-bold">2</span>
											</div>
											<div>
												<h3 className="text-lg text-left font-semibold text-white">
													Choose Goal
												</h3>
												<p className="text-gray-400">
													Define the category of people (Investors, Mentors,
													Founders)
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center">
												<span className="text-white font-bold">3</span>
											</div>
											<div>
												<h3 className="text-lg text-left font-semibold text-white">
													Get Results
												</h3>
												<p className="text-gray-400">
													AI analyzes and provides recommendations with match
													rating
												</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Replica Selection */}
			<section className="py-10 bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-white mb-4">
							Choose AI Assistant Type
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Defines AI role and interaction method
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{replicaTypes.map((replica) => (
							<Card
								key={replica.id}
								className={`bg-gray-900/50 border-gray-800 ${
									replica.borderColor
								} transition-all duration-300 cursor-pointer ${
									selectedReplicaType === replica.id
										? 'ring-2 ring-blue-500/50 border-blue-500/50'
										: 'hover:transform hover:scale-105'
								}`}
								onClick={() => handleReplicaSelection(replica.id)}
							>
								<CardContent className="p-8 text-center space-y-6">
									<div className="text-6xl mb-4">{replica.icon}</div>
									<h3 className="text-2xl font-semibold text-white mb-3">
										{replica.name}
									</h3>
									<p className="text-gray-400 leading-relaxed">
										{replica.description}
									</p>
									{selectedReplicaType === replica.id && (
										<Badge
											className={`bg-gradient-to-r ${replica.color} text-white`}
										>
											Selected
										</Badge>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Memory Status */}
			{/* {memoryState.memories.length > 0 && (
				<section className="py-10 bg-gradient-to-b from-gray-900/20 to-transparent">
					<div className="container mx-auto px-6">
						<Card className="bg-gray-900/50 border-gray-800 max-w-4xl mx-auto">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-xl font-semibold text-white">
										🧠 Replica memory loaded
									</h3>
									<Badge className="bg-green-500">
										{memoryState.memories.length} records
									</Badge>
								</div>
								<p className="text-gray-400 text-sm">
									Replica memory has been automatically loaded and is available for
									use. Last update:{' '}
									{memoryState.lastUpdated
										? new Date(memoryState.lastUpdated).toLocaleString('en-US')
										: 'Unknown'}
								</p>
								{memoryState.error && (
									<div className="mt-2 text-red-400 text-sm">
										Memory loading error: {memoryState.error}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</section>
			)} */}

			{/* Matchmaker Results */}
			{matchmakerResults ? (
				<>
					<PeopleNamesDisplay
						userInterest={matchmakerResults.userInterest}
						matches={matchmakerResults.matches}
						bestMatch={matchmakerResults.bestMatch}
					/>
					<PeopleNamesList
						matches={matchmakerResults.matches}
						bestMatch={matchmakerResults.bestMatch}
					/>

					{/* People List Triggers */}
					<section className="py-12 bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50">
						<div className="container mx-auto px-6">
							<div className="text-center mb-8">
								<h2 className="text-2xl font-bold text-white mb-2">
									Detailed Lists
								</h2>
								<p className="text-gray-400">
									Go to detailed lists of people for deeper analysis
								</p>
							</div>

							<div className="max-w-4xl mx-auto space-y-4">
								<PeopleListTrigger
									category="investors"
									query={`${matchmakerResults.userInterest} investors pre-seed early stage`}
								/>
								<PeopleListTrigger
									category="mentors"
									query={`${matchmakerResults.userInterest} mentors experts`}
								/>
								<PeopleListTrigger
									category="founders"
									query={`${matchmakerResults.userInterest} founders startups`}
								/>
							</div>
						</div>
					</section>
				</>
			) : (
				<>
					{/* Test Answer Section */}
					<TestAnswerSection />

					{/* AI Trigger Demo */}
					<section className="py-10 bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50">
						<div className="container mx-auto px-6">
							<div className="text-center mb-12">
								<h2 className="text-4xl font-bold text-white mb-4">
									AI Triggers Demo
								</h2>
								<p className="text-xl text-gray-400 max-w-2xl mx-auto">
									See how the AI agent can generate triggers for navigating to
									people lists
								</p>
							</div>
							<AITriggerDemo />
						</div>
					</section>
				</>
			)}
		</div>
	);
}
