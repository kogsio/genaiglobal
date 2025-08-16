import React, { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  title: string;
  description?: string;
  href?: string;
  cta?: string;
  className?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ title, description, href, cta = 'Learn more', className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty('--mouse-x', `${x}px`);
    ref.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const content = (
    <div
      ref={ref}
      onMouseMove={reduceMotion ? undefined : onMouseMove}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-colors',
        'hover:border-accent/60',
        className,
      )}
      style={reduceMotion ? undefined : {
        backgroundImage: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--accent)/0.12), transparent 40%)'
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {cta && (
        <div className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline">
          {cta}
        </div>
      )}
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-accent/60 rounded-lg">
      {content}
    </a>
  ) : (
    content
  );
};

export default SpotlightCard;
