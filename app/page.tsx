'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

type ReplicaType = 'matchmaker' | 'mentor' | 'buddy';
type QuickAction = 'investors' | 'mentors' | 'founders';

export default function Home() {
	const [selectedReplica, setSelectedReplica] = useState<ReplicaType | null>(
		null
	);
	const router = useRouter();

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

	const handleQuickAction = (action: QuickAction) => {
		if (!selectedReplica) return;

		// Здесь будет логика перехода к поиску с выбранной репликой и целью
		console.log(
			`Starting search with ${selectedReplica} replica for ${action}`
		);
		// router.push(`/search?replica=${selectedReplica}&action=${action}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121316] to-[#0a0a0a]">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
				<div className="container mx-auto px-6 py-20 relative">
					<div className="text-center space-y-8 max-w-4xl mx-auto">
						<Badge
							variant="outline"
							className="mb-4 bg-blue-500/10 border-blue-500/20 text-blue-400"
						>
							🚀 AI-powered networking
						</Badge>

						<h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
							Evoo
						</h1>

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
			<section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-white mb-4">
							1️⃣ Choose AI Assistant Type
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
									selectedReplica === replica.id
										? 'ring-2 ring-blue-500/50 border-blue-500/50'
										: 'hover:transform hover:scale-105'
								}`}
								onClick={() => setSelectedReplica(replica.id)}
							>
								<CardContent className="p-8 text-center space-y-6">
									<div className="text-6xl mb-4">{replica.icon}</div>
									<h3 className="text-2xl font-semibold text-white mb-3">
										{replica.name}
									</h3>
									<p className="text-gray-400 leading-relaxed">
										{replica.description}
									</p>
									{selectedReplica === replica.id && (
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

			{/* Quick Actions */}
			{selectedReplica && (
				<section className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
					<div className="container mx-auto px-6">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-white mb-4">
								2️⃣ Choose Search Goal
							</h2>
							<p className="text-xl text-gray-400 max-w-2xl mx-auto">
								Defines the category of people you want to find
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
							{quickActions.map((action) => (
								<Card
									key={action.id}
									className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
									onClick={() => handleQuickAction(action.id)}
								>
									<CardContent className="p-8 text-center space-y-6">
										<div className="text-6xl mb-4">{action.icon}</div>
										<h3 className="text-2xl font-semibold text-white mb-3">
											{action.name}
										</h3>
										<p className="text-gray-400 leading-relaxed mb-4">
											{action.description}
										</p>
										<Button
											className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90 text-white`}
										>
											Start Search
										</Button>
									</CardContent>
								</Card>
							))}
						</div>

						<div className="text-center mt-12">
							<div className="inline-flex items-center space-x-2 bg-gray-900/50 border border-gray-700 rounded-full px-6 py-3">
								<span className="text-gray-400">Selected Assistant:</span>
								<Badge
									variant="outline"
									className="text-blue-400 border-blue-400"
								>
									{replicaTypes.find((r) => r.id === selectedReplica)?.name}
								</Badge>
							</div>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
