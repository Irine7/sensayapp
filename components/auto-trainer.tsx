'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useReplica } from './replica-provider';
import {
	Bot,
	Play,
	CheckCircle,
	XCircle,
	Loader2,
	Brain,
	Users,
	Target,
	BookOpen,
} from 'lucide-react';
import { REPLICA_TEMPLATES } from '@/app/lib/replica-templates';

interface TrainingResult {
	success: boolean;
	knowledgeBaseIDs: number[];
	errors: string[];
}

interface TrainingSummary {
	totalReplicas: number;
	successful: number;
	failed: number;
	results: Record<string, TrainingResult>;
}

export default function AutoTrainer() {
	const [isTraining, setIsTraining] = useState(false);
	const [trainingProgress, setTrainingProgress] = useState(0);
	const [trainingResults, setTrainingResults] =
		useState<TrainingSummary | null>(null);
	const { replicas, selectedReplica } = useReplica();
	const { toast } = useToast();

	const handleTrainAll = async () => {
		setIsTraining(true);
		setTrainingProgress(0);
		setTrainingResults(null);

		try {
			// Simulate progress
			const progressInterval = setInterval(() => {
				setTrainingProgress((prev) => Math.min(prev + 10, 90));
			}, 500);

			const response = await fetch('/api/sensay/auto-train', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ trainAll: true }),
			});

			clearInterval(progressInterval);
			setTrainingProgress(100);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to train replicas');
			}

			const data = await response.json();
			setTrainingResults(data.summary);

			toast({
				title: 'Training Completed',
				description: `Successfully trained ${data.summary.successful}/${data.summary.totalReplicas} replicas`,
			});
		} catch (error) {
			console.error('Training error:', error);
			toast({
				title: 'Training Failed',
				description:
					error instanceof Error ? error.message : 'Unknown error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsTraining(false);
			setTimeout(() => setTrainingProgress(0), 2000);
		}
	};

	const handleTrainSelected = async () => {
		if (!selectedReplica) {
			toast({
				title: 'No Replica Selected',
				description: 'Please select a replica to train',
				variant: 'destructive',
			});
			return;
		}

		setIsTraining(true);
		setTrainingProgress(0);

		try {
			const progressInterval = setInterval(() => {
				setTrainingProgress((prev) => Math.min(prev + 20, 90));
			}, 300);

			const response = await fetch('/api/sensay/auto-train', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					replicaUuid: selectedReplica.uuid,
					replicaName: selectedReplica.name,
				}),
			});

			clearInterval(progressInterval);
			setTrainingProgress(100);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to train replica');
			}

			const data = await response.json();

			toast({
				title: 'Training Completed',
				description: `Successfully trained ${selectedReplica.name}`,
			});
		} catch (error) {
			console.error('Training error:', error);
			toast({
				title: 'Training Failed',
				description:
					error instanceof Error ? error.message : 'Unknown error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsTraining(false);
			setTimeout(() => setTrainingProgress(0), 2000);
		}
	};

	const getTemplateForReplica = (replicaName: string) => {
		return Object.values(REPLICA_TEMPLATES).find((template) =>
			replicaName.toLowerCase().includes(template.name.toLowerCase())
		);
	};

	return (
		<div className="space-y-6">
			<Card className="border border-dark-500 bg-dark-300 text-white">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5 text-gray-300" />
						<span>Auto-Trainer</span>
					</CardTitle>
					<CardDescription>
						Automatically trains replicas with specialized knowledge and
						behavior
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Selected Replica Info */}
					{selectedReplica && (
						<div className="p-4 border border-dark-500 bg-dark-400 rounded-lg">
							<div className="flex items-center gap-3">
								<div className="relative h-10 w-10 rounded-full overflow-hidden">
									<img
										src={selectedReplica.profileImage || '/coach.png'}
										alt={selectedReplica.name}
										className="h-full w-full object-cover"
									/>
								</div>
								<div>
									<h3 className="font-medium">{selectedReplica.name}</h3>
									<p className="text-sm text-gray-400">
										{selectedReplica.type}
									</p>
									{getTemplateForReplica(selectedReplica.name) && (
										<Badge variant="outline" className="mt-1 bg-dark-500">
											Template Available
										</Badge>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Training Progress */}
					{isTraining && (
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Training Progress</span>
								<span>{trainingProgress}%</span>
							</div>
							<Progress value={trainingProgress} className="h-2" />
						</div>
					)}

					{/* Training Buttons */}
					<div className="flex gap-3">
						<Button
							onClick={handleTrainSelected}
							disabled={!selectedReplica || isTraining}
							className="bg-gold-500 hover:bg-gold-600"
						>
							{isTraining ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Play className="h-4 w-4 mr-2" />
							)}
							Train Selected Replica
						</Button>

						<Button
							onClick={handleTrainAll}
							disabled={replicas.length === 0 || isTraining}
							variant="outline"
							className="border-dark-500 bg-dark-400 text-white hover:bg-dark-500"
						>
							{isTraining ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Users className="h-4 w-4 mr-2" />
							)}
							Train All Replicas
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Training Results */}
			{trainingResults && (
				<Card className="border border-dark-500 bg-dark-300 text-white">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5 text-gray-300" />
							<span>Training Results</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-3 gap-4 mb-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-300">
									{trainingResults.totalReplicas}
								</div>
								<div className="text-sm text-gray-400">Total Replicas</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-400">
									{trainingResults.successful}
								</div>
								<div className="text-sm text-gray-400">Successful</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-red-400">
									{trainingResults.failed}
								</div>
								<div className="text-sm text-gray-400">Failed</div>
							</div>
						</div>

						<div className="space-y-2">
							{Object.entries(trainingResults.results).map(([uuid, result]) => {
								const replica = replicas.find((r) => r.uuid === uuid);
								return (
									<div
										key={uuid}
										className="flex items-center justify-between p-3 border border-dark-500 bg-dark-400 rounded-lg"
									>
										<div className="flex items-center gap-3">
											{result.success ? (
												<CheckCircle className="h-5 w-5 text-green-400" />
											) : (
												<XCircle className="h-5 w-5 text-red-400" />
											)}
											<div>
												<div className="font-medium">
													{replica?.name || 'Unknown'}
												</div>
												<div className="text-sm text-gray-400">
													{result.knowledgeBaseIDs.length} training entries
													created
												</div>
											</div>
										</div>
										{result.errors.length > 0 && (
											<Badge variant="destructive" className="bg-red-600">
												{result.errors.length} errors
											</Badge>
										)}
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Available Templates */}
			<Card className="border border-dark-500 bg-dark-300 text-white">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-gray-300" />
						<span>Available Training Templates</span>
					</CardTitle>
					<CardDescription>
						Specialized training templates for different types of replicas
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{Object.values(REPLICA_TEMPLATES).map((template) => (
							<div
								key={template.name}
								className="p-4 border border-dark-500 bg-dark-400 rounded-lg"
							>
								<div className="flex items-center gap-2 mb-2">
									<Bot className="h-4 w-4 text-gray-300" />
									<h3 className="font-medium">{template.name}</h3>
								</div>
								<p className="text-sm text-gray-400 mb-3">{template.purpose}</p>
								<div className="space-y-1">
									<div className="text-xs text-gray-500">
										Training Materials:
									</div>
									<div className="text-xs">
										{template.trainingMaterials
											.slice(0, 2)
											.map((material, index) => (
												<div key={index} className="text-gray-400">
													• {material}
												</div>
											))}
										{template.trainingMaterials.length > 2 && (
											<div className="text-gray-500">
												+{template.trainingMaterials.length - 2} more
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
