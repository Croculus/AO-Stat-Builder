import { useState } from 'react';
import type { MagicsDatabase, FightStyleDatabase } from '../types';
import './SkillTable.css';

interface SkillTableProps {
  type: 'magic' | 'fstyle';
  tableIndex: number;
  magics?: MagicsDatabase;
  fstyles?: FightStyleDatabase;
  onSelect: (skillName: string, tableId: string) => void;
  selectedSkill: string | null;
}

export const SkillTable = ({
  type,
  tableIndex,
  magics,
  fstyles,
  onSelect,
  selectedSkill,
}: SkillTableProps) => {
  const tableId = `${type}${tableIndex}`;
  const ismagic = type === 'magic';
  const database = ismagic ? magics : fstyles;

  if (!database) return null;

  const items = Object.entries(database).map(([key, value]) => ({
    key,
    name: value.name,
  }));

  const numRows = ismagic ? 4 : 2;
  const numCols = ismagic ? 5 : 3;

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(items.slice(i * numCols, (i + 1) * numCols));
  }

  return (
    <div className="skill-table-container">
      <h3 className="table-title">{ismagic ? 'Magic' : 'Fight Style'}</h3>
      <table className={`${type}Table`} id={tableId}>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((item) => (
                <td
                  key={item.key}
                  id={`${item.key}${tableIndex}`}
                  className={`skill-cell ${selectedSkill === item.key ? 'selected' : ''}`}
                  onClick={() => onSelect(item.key, tableId)}
                >
                  <img
                    src={`/images/${ismagic ? 'magics' : 'fstyles'}/${item.key}.png`}
                    alt={item.name}
                    width="48"
                    title={item.name}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
