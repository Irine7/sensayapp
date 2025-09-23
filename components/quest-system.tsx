'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Award, CheckCircle2, HelpCircle } from 'lucide-react';
import { usePlayer } from './player-provider';
import { useToast } from '@/hooks/use-toast';

type Quest = {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	xpReward: number;
};

type QuestProps = {
	pageType: 'home';
};

// Quest pools by page type
const questPools: Record<string, Quest[]> = {
	home: [
		{
			id: 'home-1',
			question: 'What is the main objective of the Town team in Mafia?',
			options: [
				'To eliminate all Mafia members',
				'To survive until dawn',
				'To identify the Serial Killer',
				'To protect the Mayor',
			],
			correctAnswer: 0,
			xpReward: 20,
		},
		{
			id: 'home-2',
			question: 'How do Mafia members win the game?',
			options: [
				'By eliminating the Detective',
				'By surviving until dawn',
				'When their number equals or exceeds the Town members',
				'By identifying all neutral roles',
			],
			correctAnswer: 2,
			xpReward: 20,
		},
		{
			id: 'home-3',
			question: 'What happens during the night phase of a Mafia game?',
			options: [
				'Public voting',
				'Role-specific actions like investigations and eliminations',
				'Role reveals',
				'Team discussions',
			],
			correctAnswer: 1,
			xpReward: 20,
		},
	],
};

export default function QuestSystem({ pageType }: QuestProps) {
	const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [isAnswered, setIsAnswered] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const { addExperience } = usePlayer();
	const { toast } = useToast();

	// Select a random quest based on page type
	useEffect(() => {
		const quests = questPools[pageType] || questPools.home;
		const completedQuests = JSON.parse(
			localStorage.getItem('completedQuests') || '[]'
		);

		// Filter out completed quests
		const availableQuests = quests.filter(
			(quest) => !completedQuests.includes(quest.id)
		);

		if (availableQuests.length > 0) {
			const randomIndex = Math.floor(Math.random() * availableQuests.length);
			setCurrentQuest(availableQuests[randomIndex]);
		} else {
			// If all quests are completed, pick a random one anyway
			const randomIndex = Math.floor(Math.random() * quests.length);
			setCurrentQuest(quests[randomIndex]);
		}

		setSelectedOption(null);
		setIsAnswered(false);
		setIsCorrect(false);
	}, [pageType]);

	const handleSubmit = () => {
		if (selectedOption === null || !currentQuest) return;

		const correct = selectedOption === currentQuest.correctAnswer;
		setIsAnswered(true);
		setIsCorrect(correct);

		if (correct) {
			// Add XP reward
			addExperience(currentQuest.xpReward);

			// Mark quest as completed
			const completedQuests = JSON.parse(
				localStorage.getItem('completedQuests') || '[]'
			);
			if (!completedQuests.includes(currentQuest.id)) {
				completedQuests.push(currentQuest.id);
				localStorage.setItem(
					'completedQuests',
					JSON.stringify(completedQuests)
				);
			}

			toast({
				title: 'Quest Completed!',
				description: `You earned ${currentQuest.xpReward} XP.`,
				duration: 3000,
			});
		}
	};

	const handleNextQuest = () => {
		const quests = questPools[pageType] || questPools.home;
		const completedQuests = JSON.parse(
			localStorage.getItem('completedQuests') || '[]'
		);

		// Filter out completed quests and the current quest
		const availableQuests = quests.filter(
			(quest) =>
				!completedQuests.includes(quest.id) && quest.id !== currentQuest?.id
		);

		if (availableQuests.length > 0) {
			const randomIndex = Math.floor(Math.random() * availableQuests.length);
			setCurrentQuest(availableQuests[randomIndex]);
		} else {
			// If all quests are completed, pick a random one that's not the current one
			const otherQuests = quests.filter(
				(quest) => quest.id !== currentQuest?.id
			);
			if (otherQuests.length > 0) {
				const randomIndex = Math.floor(Math.random() * otherQuests.length);
				setCurrentQuest(otherQuests[randomIndex]);
			}
		}

		setSelectedOption(null);
		setIsAnswered(false);
		setIsCorrect(false);
	};

	if (!currentQuest) return null;

	return (
		<Card className="mt-12 border-mafia-200 dark:border-mafia-800">
			<CardHeader className="bg-mafia-50 dark:bg-mafia-900/20 rounded-t-lg">
				<div className="flex items-center justify-between">
					<CardTitle className="text-mafia-900 dark:text-mafia-300 flex items-center gap-2">
						<HelpCircle size={18} className="text-mafia-600" />
						Knowledge Quest
					</CardTitle>
					<div className="flex items-center gap-1 bg-mafia-100 dark:bg-mafia-800 rounded-full px-3 py-1 text-xs">
						<Award size={14} className="text-mafia-600" />
						<span>{currentQuest.xpReward} XP</span>
					</div>
				</div>
				<CardDescription>Test your Mafia game knowledge</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="space-y-4">
					<p className="font-medium">{currentQuest.question}</p>

					<RadioGroup
						value={selectedOption?.toString()}
						onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
					>
						{currentQuest.options.map((option, index) => (
							<div key={index} className="flex items-center space-x-2 py-2">
								<RadioGroupItem
									value={index.toString()}
									id={`option-${index}`}
									disabled={isAnswered}
									className={
										isAnswered
											? index === currentQuest.correctAnswer
												? 'border-green-500 text-green-500'
												: index === selectedOption
												? 'border-red-500 text-red-500'
												: ''
											: ''
									}
								/>
								<Label
									htmlFor={`option-${index}`}
									className={
										isAnswered
											? index === currentQuest.correctAnswer
												? 'text-green-600 dark:text-green-400'
												: index === selectedOption &&
												  index !== currentQuest.correctAnswer
												? 'text-red-600 dark:text-red-400'
												: ''
											: ''
									}
								>
									{option}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				{isAnswered ? (
					<>
						<div className="flex items-center gap-2">
							{isCorrect ? (
								<CheckCircle2 className="text-green-500" size={18} />
							) : (
								<HelpCircle className="text-red-500" size={18} />
							)}
							<span
								className={
									isCorrect
										? 'text-green-600 dark:text-green-400'
										: 'text-red-600 dark:text-red-400'
								}
							>
								{isCorrect
									? 'Correct! Well done.'
									: 'Incorrect. Try another question.'}
							</span>
						</div>
						<Button
							onClick={handleNextQuest}
							variant="outline"
							className="border-mafia-300"
						>
							Next Question
						</Button>
					</>
				) : (
					<Button
						onClick={handleSubmit}
						disabled={selectedOption === null}
						className="bg-mafia-600 hover:bg-mafia-700 ml-auto"
					>
						Submit Answer
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
