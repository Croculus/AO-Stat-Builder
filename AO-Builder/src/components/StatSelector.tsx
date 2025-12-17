import type { StatMap } from '../types';
import './StatSelector.css';

interface StatSelectorProps {
  stats: StatMap;
  maxLevel: number;
  onStatsChange: (stats: StatMap) => void;
}

export const StatSelector = ({ stats, maxLevel, onStatsChange }: StatSelectorProps) => {
  const statPoints = maxLevel * 2;
  const totalPoints = Object.values(stats).reduce((a, b) => a + b, 0);
  const remainingPoints = statPoints - totalPoints;

  const handleSliderChange = (statName: keyof StatMap, value: number) => {
    const newStats = { ...stats, [statName]: value };
    const newTotal = Object.values(newStats).reduce((a, b) => a + b, 0);
    
    if (newTotal <= statPoints) {
      onStatsChange(newStats);
    }
  };

  const handleInputChange = (statName: keyof StatMap, value: string) => {
    const int = Math.abs(parseInt(value)) || 0;
    const newStats = { ...stats, [statName]: int };
    const newTotal = Object.values(newStats).reduce((a, b) => a + b, 0);
    
    if (newTotal <= statPoints) {
      onStatsChange(newStats);
    }
  };

  return (
    <div className="stat-selector">
      {Object.entries(stats).map(([statName, value]) => (
        <div key={statName} className="stat-input-group">
          <label>{statName.charAt(0).toUpperCase() + statName.slice(1)}</label>
          <div className="stat-input">
            <input
              type="range"
              min="0"
              max={statPoints}
              value={value}
              onChange={(e) => handleSliderChange(statName as keyof StatMap, parseInt(e.target.value))}
              className="slider"
            />
            <input
              type="number"
              min="0"
              max={statPoints}
              value={value}
              onChange={(e) => handleInputChange(statName as keyof StatMap, e.target.value)}
              className="input-text"
            />
          </div>
        </div>
      ))}
      <div className="remaining">
        Remaining: {remainingPoints}
      </div>
    </div>
  );
};
