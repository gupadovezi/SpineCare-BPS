import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Chat from './components/Chat';
import { UserAssessment } from './types';
import { AlertTriangle, Phone } from 'lucide-react';

const App: React.FC = () => {
  const [assessment, setAssessment] = useState<UserAssessment | null>(null);
  const [showRedFlagWarning, setShowRedFlagWarning] = useState(false);

  const handleAssessmentComplete = (data: UserAssessment) => {
    setAssessment(data);
  };

  const handleRedFlagTrigger = () => {
    setShowRedFlagWarning(true);
  };

  if (showRedFlagWarning) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border-l-4 border-red-600 text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-2">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Medical Attention Recommended</h2>
          <div className="text-left text-slate-700 space-y-4 bg-slate-50 p-4 rounded-lg">
            <p>Based on your responses (e.g., loss of bowel control, saddle numbness, or severe trauma), you may have signs of a condition requiring immediate medical evaluation.</p>
            <p className="font-semibold">Please do not rely on an AI for this situation.</p>
          </div>
          
          <div className="space-y-3">
             <a href="tel:911" className="block w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
               <Phone size={18} /> Call Emergency Services
             </a>
             <button 
               onClick={() => window.location.reload()}
               className="block w-full py-3 text-slate-500 hover:text-slate-800 transition-colors text-sm underline"
             >
               Restart Assessment
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-slate-900">
      {!assessment ? (
        <Onboarding 
          onComplete={handleAssessmentComplete} 
          onRedFlag={handleRedFlagTrigger}
        />
      ) : (
        <Chat assessment={assessment} />
      )}
    </div>
  );
};

export default App;