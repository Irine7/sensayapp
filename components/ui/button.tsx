import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-white hover:bg-primary/90 hover:shadow-medium active:scale-95',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-medium active:scale-95',
				outline:
					'border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white hover:shadow-soft active:scale-95',
				secondary:
					'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-soft active:scale-95',
				ghost:
					'text-primary hover:bg-primary hover:text-white hover:shadow-soft active:scale-95',
				link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
				accent:
					'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-medium active:scale-95',
				gradient:
					'bg-gradient-to-r from-primary to-accent-500 text-white hover:from-primary/90 hover:to-accent-600 hover:shadow-medium active:scale-95',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-lg px-3 text-xs',
				lg: 'h-11 rounded-lg px-8 text-base',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
