import { motion } from 'framer-motion';

interface BuntingBannerProps {
  variant?: 'pink' | 'blue' | 'mixed';
}

const flagColors: Record<string, string[]> = {
  pink: ['#ECBDC3', '#A8D8EA', '#F9E8C0', '#ECBDC3', '#A8D8EA', '#F9C8B8', '#ECBDC3'],
  blue: ['#A8D8EA', '#ECBDC3', '#F9E8C0', '#A8D8EA', '#ECBDC3', '#F9E8C0', '#A8D8EA'],
  mixed: ['#ECBDC3', '#A8D8EA', '#F9E8C0', '#7CB98B', '#A8D8EA', '#ECBDC3', '#F9C8B8'],
};

export default function BuntingBanner({ variant = 'mixed' }: BuntingBannerProps) {
  const colors = flagColors[variant];

  return (
    <div className="w-full overflow-hidden py-2">
      <svg viewBox="0 0 800 60" className="w-full" preserveAspectRatio="none">
        <path
          d="M 0 15 Q 100 35, 200 15 Q 300 35, 400 15 Q 500 35, 600 15 Q 700 35, 800 15"
          fill="none"
          stroke="#422725"
          strokeWidth="2"
          opacity="0.3"
        />
        {colors.map((color, i) => {
          const x = 60 + i * 105;
          return (
            <g key={i}>
              <circle cx={x} cy={12} r="5" fill={color} opacity="0.6" />
              <motion.polygon
                points={`${x},18 ${x - 18},50 ${x + 18},50`}
                fill={color}
                stroke="#422725"
                strokeWidth="1"
                strokeOpacity="0.2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4, type: 'spring' }}
                transform-origin={`${x}px 18px`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
