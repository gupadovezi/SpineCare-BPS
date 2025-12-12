import React, { useState } from 'react';
import { AssessmentStep, UserAssessment, INITIAL_ASSESSMENT } from '../types';
import { RED_FLAGS_LIST } from '../utils/constants';
import { AlertTriangle, ArrowRight, Check, Activity, Brain, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: (assessment: UserAssessment) => void;
  onRedFlag: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onRedFlag }) => {
  const [step, setStep] = useState<AssessmentStep>(AssessmentStep.WELCOME);
  const [data, setData] = useState<UserAssessment>(INITIAL_ASSESSMENT);

  const updateData = (key: keyof UserAssessment, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const handleRedFlagCheck = (flag: string) => {
    const currentFlags = data.redFlags;
    if (currentFlags.includes(flag)) {
      updateData('redFlags', currentFlags.filter(f => f !== flag));
    } else {
      updateData('redFlags', [...currentFlags, flag]);
    }
  };

  const submitAssessment = () => {
    if (data.redFlags.length > 0) {
      onRedFlag();
    } else {
      onComplete(data);
    }
  };

  // --- Step Renders ---

  const renderWelcome = () => (
    <div className="space-y-6 text-center animate-fadeIn">
      <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
        <Activity size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Welcome to SpineCare BPS</h2>
      <p className="text-slate-600 max-w-md mx-auto">
        We use a "Biopsychosocial" approach to help with your back pain. 
        This means we look at your <b>Biology</b> (body), <b>Psychology</b> (mind), and <b>Social</b> environment 
        to create a holistic plan for you.
      </p>
      <button 
        onClick={nextStep}
        className="px-8 py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl flex items-center mx-auto gap-2"
      >
        Start Assessment <ArrowRight size={18} />
      </button>
    </div>
  );

  const renderRedFlags = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 text-red-600 mb-2">
        <AlertTriangle size={24} />
        <h3 className="text-xl font-bold">Safety Check</h3>
      </div>
      <p className="text-slate-600 text-sm">Please check any of the following that you are currently experiencing:</p>
      
      <div className="space-y-3">
        {RED_FLAGS_LIST.map((flag, idx) => (
          <label key={idx} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.redFlags.includes(flag) ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <input 
              type="checkbox" 
              className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              checked={data.redFlags.includes(flag)}
              onChange={() => handleRedFlagCheck(flag)}
            />
            <span className="text-slate-800 text-sm">{flag}</span>
          </label>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4">
         <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
           <input 
             type="checkbox" 
             checked={data.redFlags.length === 0} 
             onChange={() => updateData('redFlags', [])}
             disabled={data.redFlags.length > 0} 
             className="rounded text-teal-600 focus:ring-teal-500"
           />
           <span>None of the above</span>
         </label>
         <button 
           onClick={() => data.redFlags.length > 0 ? onRedFlag() : nextStep()}
           className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
         >
           Next
         </button>
      </div>
    </div>
  );

  const renderBiological = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 text-teal-600 mb-2">
        <Activity size={24} />
        <h3 className="text-xl font-bold">Biological Factors</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">How long have you had this pain?</label>
        <select 
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={data.painDuration}
          onChange={(e) => updateData('painDuration', e.target.value)}
        >
          <option value="">Select duration</option>
          <option value="Less than 1 week (Acute)">Less than 1 week</option>
          <option value="1-6 weeks (Sub-acute)">1-6 weeks</option>
          <option value="3-6 months (Chronic)">3-6 months</option>
          <option value="Over 6 months (Persistent)">Over 6 months</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Pain Intensity (0-10)</label>
        <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" max="10" 
              value={data.painIntensity}
              onChange={(e) => updateData('painIntensity', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <span className="text-lg font-bold text-teal-700 w-8">{data.painIntensity}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">What makes it worse? (e.g., sitting, bending)</label>
        <input 
          type="text"
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          placeholder="Type here..."
          onChange={(e) => updateData('aggravatingFactors', [e.target.value])}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button 
           onClick={nextStep}
           disabled={!data.painDuration}
           className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50"
         >
           Next
         </button>
      </div>
    </div>
  );

  const renderPsychological = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 text-purple-600 mb-2">
        <Brain size={24} />
        <h3 className="text-xl font-bold">Psychological Factors</h3>
      </div>
      
      <p className="text-sm text-slate-500 italic">How we think and feel affects how we experience pain.</p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">How afraid are you to move your back? (0 = Not at all, 10 = Terrified)</label>
        <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" max="10" 
              value={data.fearAvoidance}
              onChange={(e) => updateData('fearAvoidance', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <span className="text-lg font-bold text-purple-700 w-8">{data.fearAvoidance}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Current Stress Level (0-10)</label>
        <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" max="10" 
              value={data.stressLevel}
              onChange={(e) => updateData('stressLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <span className="text-lg font-bold text-purple-700 w-8">{data.stressLevel}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">How is your mood lately?</label>
        <select 
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          value={data.mood}
          onChange={(e) => updateData('mood', e.target.value)}
        >
          <option value="">Select mood</option>
          <option value="Optimistic">Optimistic</option>
          <option value="Neutral">Neutral</option>
          <option value="Anxious/Worried">Anxious/Worried</option>
          <option value="Depressed/Low">Depressed/Low</option>
          <option value="Frustrated">Frustrated</option>
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <button 
           onClick={nextStep}
           disabled={!data.mood}
           className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50"
         >
           Next
         </button>
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 text-orange-600 mb-2">
        <Users size={24} />
        <h3 className="text-xl font-bold">Social Factors</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Work Status</label>
        <select 
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          value={data.workStatus}
          onChange={(e) => updateData('workStatus', e.target.value)}
        >
          <option value="">Select status</option>
          <option value="Full-time">Working Full-time</option>
          <option value="Part-time">Working Part-time</option>
          <option value="Off work due to pain">Off work due to pain</option>
          <option value="Retired/Student/Other">Retired / Student / Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Do you feel supported by family/friends?</label>
        <select 
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          value={data.socialSupport}
          onChange={(e) => updateData('socialSupport', e.target.value)}
        >
          <option value="">Select option</option>
          <option value="Very Supported">Very Supported</option>
          <option value="Somewhat Supported">Somewhat Supported</option>
          <option value="Isolated/Alone">Isolated / Alone</option>
        </select>
      </div>

       <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">What is your main goal?</label>
        <input 
          type="text"
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          placeholder="e.g., Play with grandkids, sleep better..."
          onChange={(e) => updateData('goals', e.target.value)}
          value={data.goals}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button 
           onClick={submitAssessment}
           disabled={!data.workStatus || !data.socialSupport}
           className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
         >
           Create Care Plan <Check size={16} />
         </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 border border-slate-100">
        {step === AssessmentStep.WELCOME && renderWelcome()}
        {step === AssessmentStep.RED_FLAGS && renderRedFlags()}
        {step === AssessmentStep.BIOLOGICAL && renderBiological()}
        {step === AssessmentStep.PSYCHOLOGICAL && renderPsychological()}
        {step === AssessmentStep.SOCIAL && renderSocial()}
      </div>
    </div>
  );
};

export default Onboarding;