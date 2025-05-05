import React from 'react';
import { motion } from 'framer-motion';

const character = {
  'Animal': '🐶',
  'Elderly': '👵',
  'Greener Planet': '🌱',
  'Sports': '⚽',
  'Medical': '🧬',
  'Disability': '♿',
  'Community': '🤝',
  'Educational': '🎓',
}

const InterestsStep = ({ interests, selectedInterests, onToggle, onNext, onBack }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 mb-6 text-center"
      >
        What causes interest you?
      </motion.h2>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
      >
        {interests.map((interest) => (
          <motion.div
            key={interest.id}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => onToggle(interest.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                ${selectedInterests.includes(interest.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="text-3xl">{character[interest.category]}</span>
              <span className="font-medium">{interest.name}</span>
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between"
      >
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedInterests.length === 0}
          className={`px-6 py-2 rounded-full text-white transition-all duration-200
            ${selectedInterests.length > 0
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default InterestsStep; 
