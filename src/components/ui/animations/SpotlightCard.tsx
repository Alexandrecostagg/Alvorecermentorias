import { FC, ReactNode, useRef } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(244, 192, 72, 0.15)' // Alvorecer gold
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};
