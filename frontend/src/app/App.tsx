import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { PageTransition } from "../components/layout/PageTransition";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { useBootstrapAuth } from "../hooks/useAuth";

import { HomePage } from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";
import { SearchPage } from "../pages/SearchPage";
import { MovieDetailsPage } from "../pages/MovieDetailsPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProfilePage } from "../pages/ProfilePage";
import { FollowersPage } from "../pages/FollowersPage";
import { FollowingPage } from "../pages/FollowingPage";
import { UserRatingsPage } from "../pages/UserRatingsPage";
import { UserReviewsPage } from "../pages/UserReviewsPage";
import { FeedPage } from "../pages/FeedPage";
import { ListDetailsPage } from "../pages/ListDetailsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ScrollToTop } from "../components/layout/ScrollToTop";
import { NetworkActivityBar } from "../components/layout/NetworkActivityBar";

export const App = () => {
  useBootstrapAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <NetworkActivityBar />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/filmes/:category"
              element={
                <PageTransition>
                  <CategoryPage />
                </PageTransition>
              }
            />
            <Route
              path="/buscar"
              element={
                <PageTransition>
                  <SearchPage />
                </PageTransition>
              }
            />
            <Route
              path="/filme/:tmdbId"
              element={
                <PageTransition>
                  <MovieDetailsPage />
                </PageTransition>
              }
            />
            <Route
              path="/entrar"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/registrar"
              element={
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              }
            />
            <Route
              path="/perfil/:username"
              element={
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              }
            />
            <Route
              path="/perfil/:username/seguidores"
              element={
                <PageTransition>
                  <FollowersPage />
                </PageTransition>
              }
            />
            <Route
              path="/perfil/:username/seguindo"
              element={
                <PageTransition>
                  <FollowingPage />
                </PageTransition>
              }
            />
            <Route
              path="/perfil/:username/avaliacoes"
              element={
                <PageTransition>
                  <UserRatingsPage />
                </PageTransition>
              }
            />
            <Route
              path="/perfil/:username/resenhas"
              element={
                <PageTransition>
                  <UserReviewsPage />
                </PageTransition>
              }
            />
            <Route
              path="/listas/:id"
              element={
                <PageTransition>
                  <ListDetailsPage />
                </PageTransition>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <FeedPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};
