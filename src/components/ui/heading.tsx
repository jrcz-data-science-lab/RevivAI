import { cn } from '@/lib/utils';
import type * as React from 'react';

interface HeadingProps {
	children: React.ReactNode;
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	className?: string;
}

export function Heading({ children, as: Element = 'h1', className }: HeadingProps) {
	return <Element className={cn('text-xl font-serif font-bold mb-2', className)}>{children}</Element>;
}
