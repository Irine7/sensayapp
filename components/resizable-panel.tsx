'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import ChatInterface from './chat-interface';
import { useSidebar } from './sidebar-context';

interface ResizablePanelProps {
	children: React.ReactNode;
	className?: string;
	defaultWidth?: number;
	minWidth?: number;
	maxWidth?: number;
}

export default function ResizablePanel({
	children,
	className,
	defaultWidth = 300,
	minWidth = 250,
	maxWidth = 600,
}: ResizablePanelProps) {
	const [width, setWidth] = useState(defaultWidth);
	const [isResizing, setIsResizing] = useState(false);
	const resizableRef = useRef<HTMLDivElement>(null);
	const { isAIChatVisible } = useSidebar();

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizing) return;

			// Calculate new width based on mouse position
			const newWidth = e.clientX;

			// Apply constraints
			if (newWidth >= minWidth && newWidth <= maxWidth) {
				setWidth(newWidth);
			}
		};

		const handleMouseUp = () => {
			setIsResizing(false);
			document.body.style.cursor = 'default';
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};

		if (isResizing) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			document.body.style.cursor = 'ew-resize';
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isResizing, minWidth, maxWidth]);

	// Start resizing when the handle is clicked
	const startResizing = () => {
		setIsResizing(true);
	};

	if (!isAIChatVisible) {
		return <div className="w-full h-full">{children}</div>;
	}

	return (
		<div className="flex h-full w-full">
			{/* Resizable chat panel */}
			<div
				ref={resizableRef}
				className={cn(
					'h-full relative border-r border-border/50 bg-surface-50 dark:bg-surface-50',
					className
				)}
				style={{
					width: `${width}px`,
					minWidth: `${minWidth}px`,
					maxWidth: `${maxWidth}px`,
				}}
			>
				<ChatInterface />
				{/* Resize handle */}
				<div
					className="absolute top-0 right-0 w-1 h-full bg-border/50 hover:bg-primary cursor-ew-resize transition-colors duration-200"
					onMouseDown={startResizing}
				/>
			</div>

			{/* Main content */}
			<div className="flex-1 h-full overflow-auto">{children}</div>
		</div>
	);
}
