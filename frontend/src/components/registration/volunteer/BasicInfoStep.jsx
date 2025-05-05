import React from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import {HASUPPERCASE, HASSPECIALCHAR, HASNUMBER, MINLENGTH} from '../../constants.js';

const BasicInfoStep = ({ formData, setFormData, onNext, onBack }) => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if(message == "Password is strong." && formData.password == formData.password2){
      onNext();
    }
    
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('/api/auth/google/callback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          access_token: credentialResponse.credential,
          user_type: 'volunteer'
        }),
      });
      
      await response.json();
      if (!response.ok) {
        throw new Error('Google registration failed');
      }

      //onRegisterSuccess(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const validatePassword = (password) => {
    const minLength = MINLENGTH;
    const hasNumber = HASNUMBER;
    const hasSpecialChar = HASSPECIALCHAR;
    const hasUppercase = HASUPPERCASE;

    if (password.length < minLength) {
      setMessage("Password must be at least 8 characters.");
    } else if (!hasNumber.test(password)) {
      setMessage("Password must include a number.");
    } else if (!hasSpecialChar.test(password)) {
      setMessage("Password must include a special character.");
    } else if (!hasUppercase.test(password)) {
      setMessage("Password must include an uppercase letter.");
    } else {
      setMessage("Password is strong.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Google registration failed')}
        className="mb-4"
        containerProps={{ allow: "identity-credentials-get" }}
        use_fedcm_for_prompt
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            required
            value={formData.f_name}
            onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            required
            value={formData.l_name}
            onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            required
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const newPassword = e.target.value;
              setFormData({ ...formData, password: newPassword });
              validatePassword(newPassword);
            }}
          />
        </div>

        <p id="message" className="text-sm mt-1 text-black font-bold">{message}</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Again
          </label>
          <input
            type="password"
            required
            value={formData.password2}
            onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BasicInfoStep; 
