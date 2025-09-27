'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import {
	MessageSquare,
	User,
	ChevronDown,
	Award,
	LogOut,
	Settings,
	Database,
	History,
	LayoutGrid,
	RefreshCcw,
	Bot,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHeader } from '@/components/header-context';
import { useReplica } from './replica-context';
import { useSidebar } from './sidebar-context';
import { Skeleton } from '@/components/ui/skeleton';

function HeaderInner() {
	const pathname = usePathname();
	const [playerName] = useState('User');
	const { isAIChatVisible, toggleAIChat } = useSidebar();
	const t = useTranslations();

	// Navigation items divided by categories

	const adminItems = [
		{ name: t('menu.apiSettings'), path: '/admin/settings' },
		{ name: t('menu.apiKeys'), path: '/api-keys' },
	];

	const sensayTrainingItems = [
		{ name: t('menu.aiTraining'), path: '/training' },
		{ name: t('menu.replicas'), path: '/replicas' },
		{ name: t('menu.chatHistory'), path: '/chat-history' },
	];

	const gameItems: { name: string; path: string }[] = [];

	const experimentalItems = [
		{ name: t('menu.experimentalApi'), path: '/experimental' },
	];

	const { headerState } = useHeader();
	return (
		<header className="border-b bg-background/95 backdrop-blur-md text-foreground sticky top-0 z-50">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">
						{t('app.title')}
					</h1>

					<nav className="hidden md:flex items-center gap-6">
						<Link
							href="/"
							className={`text-sm font-medium transition-colors hover:text-primary ${
								pathname === '/' ? 'text-primary' : 'text-foreground'
							}`}
						>
							{t('navigation.home')}
						</Link>

						{/* Dropdown menu for administration */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">
										{t('navigation.administration')}
									</span>
									<ChevronDown size={14} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{adminItems.map((item) => (
									<DropdownMenuItem key={item.path} asChild>
										<Link
											href={item.path}
											className={
												pathname === item.path
													? 'bg-accent text-accent-foreground'
													: ''
											}
										>
											{item.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Dropdown menu for AI training through Sensay API */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">
										{t('navigation.aiTraining')}
									</span>
									<ChevronDown size={14} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{sensayTrainingItems.map((item) => (
									<DropdownMenuItem key={item.path} asChild>
										<Link
											href={item.path}
											className={
												pathname === item.path
													? 'bg-accent text-accent-foreground'
													: ''
											}
										>
											{item.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Dropdown menu for experimental API */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">
										{t('navigation.experimental')}
									</span>
									<ChevronDown size={14} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{experimentalItems.map((item) => (
									<DropdownMenuItem key={item.path} asChild>
										<Link
											href={item.path}
											className={
												pathname === item.path
													? 'bg-accent text-accent-foreground'
													: ''
											}
										>
											{item.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleAIChat}
						className="text-foreground hover:bg-surface-200 hover:text-foreground rounded-lg transition-all duration-200 hover:shadow-soft"
						title={
							isAIChatVisible ? t('ai.hideAssistant') : t('ai.showAssistant')
						}
					>
						<MessageSquare
							className={isAIChatVisible ? 'text-primary' : 'text-foreground'}
						/>
					</Button>

					<ModeToggle />

					<LanguageSwitcher />

					{/* Replica Selection Dropdown */}
					<ReplicaDropdown />

					{/* <DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground"
							>
								<div className="flex items-center gap-2">
									<div className="bg-secondary rounded-full p-1">
										<User size={16} />
									</div>
									<span className="hidden sm:inline">{playerName}</span>
									<div className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5 text-xs">
										<Award size={12} className="text-yellow-400" />
										<span>{playerLevel.level}</span>
									</div>
								</div>
								<ChevronDown size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-64">
							<DropdownMenuLabel>
								<div className="flex flex-col gap-1">
									<span>{playerName}</span>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Award size={14} className="text-yellow-500" />
										<span>Level {playerLevel.level}</span>
									</div>
									<div className="mt-2 space-y-1">
										<div className="flex justify-between text-xs">
											<span>Experience</span>
											<span>
												{playerLevel.currentXP}/{playerLevel.requiredXP} XP
											</span>
										</div>
										<Progress
											value={progressPercentage}
											className="h-2 bg-mafia-200"
											indicatorClassName="bg-mafia-600"
										/>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Award className="mr-2 h-4 w-4" />
								<span>Achievements</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Sign out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu> */}
				</div>
			</div>
		</header>
	);
}

// Replica dropdown component for header
function ReplicaDropdown() {
	const {
		replicas,
		selectedReplicaUuid,
		setSelectedReplicaUuid,
		loading,
		refreshReplicas,
		selectedReplica,
	} = useReplica();
	const t = useTranslations();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
				>
					<Bot size={14} className="mr-1" />
					<span className="text-sm font-medium">
						{loading
							? t('replica.loadingReplicas')
							: selectedReplica
							? selectedReplica.name
							: t('replica.selectReplica')}
					</span>
					<ChevronDown size={14} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{t('replica.activeReplica')}</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{loading ? (
					<div className="px-2 py-1">
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-full mt-1" />
						<Skeleton className="h-5 w-full mt-1" />
					</div>
				) : replicas.length > 0 ? (
					replicas.map((replica) => (
						<DropdownMenuItem
							key={replica.uuid}
							onClick={() => setSelectedReplicaUuid(replica.uuid)}
							className={
								selectedReplicaUuid === replica.uuid
									? 'bg-accent text-accent-foreground'
									: ''
							}
						>
							{replica.name}
							<span className="ml-2 text-xs opacity-70">({replica.type})</span>
						</DropdownMenuItem>
					))
				) : (
					<DropdownMenuItem disabled>
						{t('replica.noReplicasAvailable')}
					</DropdownMenuItem>
				)}

				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={refreshReplicas}>
					<RefreshCcw className="h-4 w-4 mr-2" />
					{t('replica.refreshReplicas')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default HeaderInner;
