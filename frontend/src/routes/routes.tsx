// src/routes/Routes.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../components/pages/home';
import AboutUsPage from '../components/pages/about-us';
import OurApproachPage from '../components/pages/OurApproach';
import ResearchPage from '../components/pages/Research';
import PrivacyPolicyPage from '../components/pages/PrivacyPolicy';
import ContactPage from '../components/pages/Contact';
import LoginModule from '../components/auth/login-module';
import SignupModule from '../components/auth/signup-module';
import EmailVerification from '../components/auth/email-verification';
import Dashboard from '../components/dashboard/dashboard';
import AccountPage from '../components/pages/account';
import SecurityPage from '../components/pages/account/SecurityPage';
import FinalResults from '../components/dashboard/final-ai-results/final-results';
import PrivateRoute from './private-routes'; // Update the import path
import { NoPageFound } from '../components/pages/NoPageFound';

// Game imports
import ColorDotsPage from '../components/games/game-pages/color-dots-page';
import ColorShapesPage from '../components/games/game-pages/color-shapes-page';
import GridMemoryPage from '../components/games/game-pages/grid-memory-page';
import SymbolSearchPage from '../components/games/game-pages/symbol-search-page';

// Survey imports
import GenericSurvey from '../components/surveys/generic-survey';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/our-approach" element={<OurApproachPage />} />
      <Route path="/research" element={<ResearchPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginModule />} />
      <Route path="/sign-up" element={<SignupModule />} />
      <Route path="/verify-email" element={<EmailVerification />} />

      {/* Account Routes - Requires Authentication */}
      <Route
        path="/account"
        element={
          <PrivateRoute requiresMember={false}>
            <AccountPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/security"
        element={
          <PrivateRoute requiresMember={false}>
            <SecurityPage />
          </PrivateRoute>
        }
      />

      {/* Member Only Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute requiresMember={true}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Game Routes */}
      <Route
        path="/games/color-dots"
        element={
          <PrivateRoute requiresMember={true}>
            <ColorDotsPage />
          </PrivateRoute>
        }
      />
      {/* ... other game routes ... */}

      {/* Survey Routes */}
      <Route
        path="/surveys/:surveyId"
        element={
          <PrivateRoute requiresMember={true}>
            <GenericSurvey surveyId="AttentionSurvey" />
          </PrivateRoute>
        }
      />

      {/* Results Route */}
      <Route
        path="/final-results"
        element={
          <PrivateRoute requiresMember={true}>
            <FinalResults />
          </PrivateRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NoPageFound />} />
    </Routes>
  );
};

export default AppRoutes;
