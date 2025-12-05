
import React from 'react';
import OddsCalculator from './OddsCalculator';
import TeamComparator from './TeamComparator';
import DifficultyVisualizer from './DifficultyVisualizer';
import NewsSection from './NewsSection';

const WorldCupHub: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="bg-blue-900 py-12 text-center text-white">
         <h1 className="text-5xl font-oswald font-bold uppercase mb-2">Central Copa 2026</h1>
         <p className="text-blue-200">Hub de ferramentas, simuladores e notícias oficiais.</p>
      </div>
      
      <div id="simulator">
         <OddsCalculator />
      </div>
      
      <div id="comparator" className="border-t border-slate-200">
         <TeamComparator />
      </div>
      
      <div id="stats">
         <DifficultyVisualizer />
      </div>
      
      <div id="news">
         <NewsSection />
      </div>
    </div>
  );
};

export default WorldCupHub;
