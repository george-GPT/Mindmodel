// src/routes/Routes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../components/pages/home';
import AboutUsPage from '../components/pages/about-us';
import OurApproachPage from '../components/pages/our-approach';
import ResearchPage from '../components/pages/research';
import PrivacyPolicyPage from '../components/pages/privacy-policy';
import ContactPage from '../components/pages/contact';
import LoginModule from '../components/auth/loginModule';
import SignupModule from '../components/auth/signupModule';
import EmailVerification from '../components/auth/emailVerification';
import Dashboard from '../components/dashboard/dashboard';
import AccountPage from '../components/pages/account';
import SecurityPage from '../components/pages/account/SecurityPage';
import FinalResults from '../components/dashboard/final-ai-results/final-results';
import PrivateRoute from './privateRoutes';
import { NoPageFound } from '../components/pages/no-page-found';

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

      {/* Member Area */}
      <Route
        path="/app"
        element={
          <PrivateRoute requiresMember={true}>
            <Routes>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />
              
              {/* Games Section */}
              <Route path="games">
                <Route path="color-dots" element={<ColorDotsPage />} />
                <Route path="color-shapes" element={<ColorShapesPage />} />
                <Route path="grid-memory" element={<GridMemoryPage />} />
                <Route path="symbol-search" element={<SymbolSearchPage />} />
              </Route>

              {/* Surveys Section */}
              <Route path="surveys/:surveyId" element={<GenericSurvey surveyId="AttentionSurvey" />} />

              {/* Results */}
              <Route path="final-results" element={<FinalResults />} />
            </Routes>
          </PrivateRoute>
        }
      />

      {/* Legacy Routes - Redirect to new structure */}
      <Route
        path="/dashboard"
        element={<Navigate to="/app" replace />}
      />
      <Route
        path="/games/*"
        element={<Navigate to="/app/games" replace />}
      />
      <Route
        path="/surveys/*"
        element={<Navigate to="/app/surveys" replace />}
      />
      <Route
        path="/final-results"
        element={<Navigate to="/app/final-results" replace />}
      />

      {/* 404 Route */}
      <Route path="*" element={<NoPageFound />} />
    </Routes>
  );
};

export default AppRoutes;
