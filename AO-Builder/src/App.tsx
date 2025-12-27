import { useState, useEffect } from 'react';
import './App.css';
import { StatSelector } from './components/StatSelector';
import { SkillTable } from './components/SkillTable';
import type { StatMap, BuildsDatabase, MagicsDatabase, FightStyleDatabase, TableSelection } from './types';
import { calculateBuild } from './utils/buildCalculator';

function App() {
  const [stats, setStats] = useState<StatMap>({
    vitality: 0,
    magic: 0,
    weapons: 0,
    strength: 0,
  });

  const [builds, setBuilds] = useState<BuildsDatabase | null>(null);
  const [magics, setMagics] = useState<MagicsDatabase | null>(null);
  const [fstyles, setFstyles] = useState<FightStyleDatabase | null>(null);
  const [currentBuild, setCurrentBuild] = useState<string>('Savant');
  const [tableSelections, setTableSelections] = useState<TableSelection>({});
  const [buildTabs, setBuildTabs] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [buildsData, magicsData, fstylesData] = await Promise.all([
          fetch('/builds.json').then((res) => res.json()), // takes every build defined and indexes the build database
          fetch('/magics.json').then((res) => res.json()),
          fetch('/fstyles.json').then((res) => res.json()),
        ]);
        setBuilds(buildsData);
        setMagics(magicsData);
        setFstyles(fstylesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Calculate build when stats change
  useEffect(() => {
    if (builds) {
      const newBuild = calculateBuild(stats, builds);
      setCurrentBuild(newBuild); 
      setBuildTabs(builds[newBuild]?.tabs || []); //?. is optional chaining, which lets us safely access elements (returns null instead of errors)
      // remember, newBuild is a string so we use it as the key to access the 'tabs' property for that build within the buildsDB
    }
  }, [stats, builds]); // this line means it runs on start and when stats or builds variables change

  const handleSkillSelect = (skillName: string, tableId: string) => {
    setTableSelections((prev) => ({
      ...prev,
      [tableId]: prev[tableId] === skillName ? null : skillName,
    }));
  };

  if (!builds || !magics || !fstyles) { // case when data not loaded (one of these values is null)
    return (
      <div className="app">
        <h1>AO Stat Builder</h1>
        <p className="loading">Loading data...</p>
      </div>
    );
  }

  const buildColor = builds[currentBuild]?.color || '#ffffff';
  
  // make maxLevel a context variable?
  return (
    <div className="app">
      <div className="container">
        <h1>AO Stat Builder</h1>
        <h2 id="build" style={{ color: buildColor }}>
          {currentBuild}
        </h2>

        <StatSelector stats={stats} maxLevel={140} onStatsChange={setStats} />

        <div id="tables" className="tables-container">
          {buildTabs.map((tab, index) => {
            if (tab === 'magic') {
              const tableId = `magic${index}`;
              return (
                <SkillTable
                  key={tableId}
                  type="magic"
                  tableIndex={index}
                  magics={magics}
                  onSelect={handleSkillSelect} // function to be passed to all icons
                  selectedSkill={tableSelections[tableId] || null} //we handle skill selection above and pass it into here
                />
              );
            } else if (tab === 'fstyle') {
              const tableId = `fstyle${index}`;
              return (
                <SkillTable
                  key={tableId}
                  type="fstyle"
                  tableIndex={index}
                  fstyles={fstyles}
                  onSelect={handleSkillSelect}
                  selectedSkill={tableSelections[tableId] || null}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
