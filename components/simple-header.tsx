'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown, Bot } from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { useReplica } from './replica-provider';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function SimpleHeader() {
	const pathname = usePathname();
	const { toggleAIChat } = useSidebar();
	const { selectedReplica, replicas, selectReplicaByType } = useReplica();

	const adminItems = [
		{
			name: 'API Settings',
			path: '/admin/settings',
		},
		{ name: 'API Keys', path: '/api-keys' },
	];

	const sensayTrainingItems = [
		{ name: 'AI Training', path: '/training' },
		{ name: 'Replicas', path: '/replicas' },
		{ name: 'Chat History', path: '/chat-history' },
	];

	const experimentalItems = [
		{
			name: 'Experimental API',
			path: '/experimental',
		},
	];

	return (
		<header className="border-b bg-background/95 backdrop-blur-md text-foreground sticky top-0 z-50">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link
						href="/"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							pathname === '/' ? 'text-primary' : 'text-foreground'
						}`}
					>
						<h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">
							Evoo
						</h1>
					</Link>

					<nav className="hidden md:flex items-center gap-6">
						{/* Dropdown menu for administration */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">Administration</span>
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

						{/* Dropdown menu for AI training */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">AI Training</span>
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
									<span className="text-sm font-medium">Experimental</span>
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
						className="text-foreground hover:bg-surface-200 hover:text-foreground rounded-lg transition-all duration-200 hover:shadow-soft"
						title="AI Assistant"
						onClick={toggleAIChat}
					>
						<MessageSquare className="text-foreground" />
					</Button>

					<ModeToggle />

					{/* Replica Selection */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
							>
								<Bot size={14} className="mr-1" />
								<span className="text-sm font-medium">
									{selectedReplica ? selectedReplica.name : 'Select Replica'}
								</span>
								<ChevronDown size={14} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Active Replica</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{replicas.length > 0 ? (
								replicas.map((replica) => (
									<DropdownMenuItem
										key={replica.uuid}
										onClick={() => selectReplicaByType(replica.name)}
										className={
											selectedReplica?.uuid === replica.uuid ? 'bg-accent' : ''
										}
									>
										<div className="flex items-center gap-2">
											<div className="relative h-6 w-6 rounded-full overflow-hidden">
												<img
													src={replica.profileImage || '/coach.png'}
													alt={replica.name}
													className="h-full w-full object-cover"
													onError={(e) => {
														(e.target as HTMLImageElement).src = '/coach.png';
													}}
												/>
											</div>
											<div>
												<div className="font-medium">{replica.name}</div>
												<div className="text-xs text-muted-foreground">
													{replica.type}
												</div>
											</div>
										</div>
									</DropdownMenuItem>
								))
							) : (
								<DropdownMenuItem disabled>
									No replicas available
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
