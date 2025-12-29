import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, UserPlus, Trash2, Sparkles, AlertCircle, AlertTriangle } from 'lucide-react';
import { Person } from '../types';
import { generateDemoList } from '../services/geminiService';

interface InputSectionProps {
  people: Person[];
  setPeople: (people: Person[]) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ people, setPeople }) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identify duplicates
  const nameCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    people.forEach(p => {
      const key = p.name.trim().toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [people]);

  const hasDuplicates = Object.values(nameCounts).some(count => count > 1);

  const handleAddFromText = () => {
    if (!inputText.trim()) return;
    
    const newNames = inputText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    const newPeople: Person[] = newNames.map(name => ({
      id: crypto.randomUUID(),
      name
    }));

    setPeople([...people, ...newPeople]);
    setInputText('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split(/\r\n|\n/);
      // Simple CSV parsing: assumes first column is name or just a list of names
      const newNames = lines
        .map(line => {
          // Remove commas if it's a simple list, or take first cell
          const parts = line.split(',');
          return parts[0].trim();
        })
        .filter(name => name.length > 0 && name.toLowerCase() !== 'name'); // Basic header filtering

      const newPeople: Person[] = newNames.map(name => ({
        id: crypto.randomUUID(),
        name
      }));

      setPeople([...people, ...newPeople]);
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const names = await generateDemoList(20);
    const newPeople: Person[] = names.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    setPeople([...people, ...newPeople]);
    setIsGenerating(false);
  };

  const clearList = () => {
    if (window.confirm('Are you sure you want to clear the entire list?')) {
      setPeople([]);
    }
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const uniquePeople: Person[] = [];
    
    // Keep the first occurrence, remove subsequent duplicates
    for (const p of people) {
      const key = p.name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniquePeople.push(p);
      }
    }
    
    setPeople(uniquePeople);
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            Add People
          </h2>
          
          <textarea
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"
            placeholder="Paste names here (one per line)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleAddFromText}
              disabled={!inputText.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Add Text
            </button>
            
            <input
              type="file"
              accept=".csv,.txt"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <span className="animate-spin text-xl">⟳</span>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              AI Demo Data
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
             <AlertCircle className="w-3 h-3" /> Supports CSV or plain text files.
          </p>
        </div>

        {/* List Review Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px] lg:h-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                {people.length}
              </span>
              Current List
            </h2>
            <div className="flex items-center gap-3">
              {hasDuplicates && (
                <button
                  onClick={handleRemoveDuplicates}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-amber-50"
                  title="Remove duplicate names"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Remove Duplicates
                </button>
              )}
              {people.length > 0 && (
                <button
                  onClick={clearList}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {people.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                <UserPlus className="w-12 h-12 mb-2 opacity-50" />
                <p>No participants yet.</p>
              </div>
            ) : (
              people.map((person) => {
                const isDuplicate = nameCounts[person.name.trim().toLowerCase()] > 1;
                return (
                  <div
                    key={person.id}
                    className={`flex justify-between items-center p-3 rounded-lg group transition-colors ${
                      isDuplicate 
                        ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100' 
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isDuplicate && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" title="Duplicate name" />
                      )}
                      <span className={`font-medium truncate ${isDuplicate ? 'text-amber-900' : 'text-slate-700'}`}>
                        {person.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removePerson(person.id)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2"
                      aria-label="Remove person"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;