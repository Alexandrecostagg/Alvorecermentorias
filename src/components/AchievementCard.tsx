import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AchievementCardProps {
  icon: LucideIcon;
  number: string;
  label: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ icon: IconComponent, number, label }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="bg-amber-100 rounded-full p-3"> {/* De bg-amber-100 (mas mantido como exemplo de cor clara) */}
          <IconComponent className="h-6 w-6 text-amber-700" aria-hidden="true" /> {/* De text-red-700 para text-amber-700 */}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900" aria-label={`${number} ${label}`}>{number}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;