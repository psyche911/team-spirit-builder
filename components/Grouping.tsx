import React, { useState } from 'react';
import { Users, Grid, Shuffle, Copy, Download } from 'lucide-react';
import { Person, Group } from '../types';

interface GroupingProps {
  people: Person[];
}

const Grouping: React.FC<GroupingProps> = ({ people }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // Colors for group headers
  const groupColors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 
    'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-orange-500'
  ];

  const handleGroup = () => {
    if (people.length === 0) return;
    
    // Fisher-Yates Shuffle
    const shuffled = [...people];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newGroups: Group[] = [];
    let groupId = 1;
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      const chunk = shuffled.slice(i, i + groupSize);
      newGroups.push({
        id: groupId++,
        members: chunk
      });
    }

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const copyResults = () => {
    const text = groups.map(g => `Group ${g.id}:\n${g.members.map(m => `- ${m.name}`).join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Grouping results copied to clipboard!');
  };

  const downloadCSV = () => {
    // Basic CSV construction
    let csvContent = "Group Number,Member Name\n";
    
    groups.forEach(group => {
      group.members.forEach(member => {
        // Handle quotes in names by escaping them
        const safeName = member.name.includes(',') || member.name.includes('"') 
          ? `"${member.name.replace(/"/g, '""')}"` 
          : member.name;
        csvContent += `${group.id},${safeName}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'grouping_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Group Size (People per group)
            </label>
            <div className="flex items-center gap-4">
               <input
                type="number"
                min="1"
                max={people.length || 100}
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-center"
              />
              <span className="text-slate-500 text-sm">
                Expected Groups: {people.length > 0 ? Math.ceil(people.length / groupSize) : 0}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleGroup}
              disabled={people.length === 0}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              Generate Groups
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {isGenerated && groups.length > 0 && (
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
               <Grid className="w-5 h-5 text-indigo-600" />
               Generated Groups
             </h3>
             <div className="flex gap-2">
               <button
                  onClick={downloadCSV}
                  className="text-slate-600 hover:text-slate-800 text-sm font-medium flex items-center gap-1 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
               <button
                  onClick={copyResults}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </button>
             </div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group, idx) => (
              <div 
                key={group.id} 
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow animate-scale-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`${groupColors[idx % groupColors.length]} px-4 py-2 flex justify-between items-center text-white`}>
                  <span className="font-bold">Group {group.id}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {group.members.length} members
                  </span>
                </div>
                <div className="p-4 flex-1">
                  <ul className="space-y-2">
                    {group.members.map(member => (
                      <li key={member.id} className="text-slate-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!isGenerated && people.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Users className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">Ready to group {people.length} participants.</p>
          <p className="text-sm opacity-70">Set the group size above and click Generate.</p>
        </div>
      )}

      {people.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          Please add participants in the Input tab first.
        </div>
      )}

    </div>
  );
};

export default Grouping;