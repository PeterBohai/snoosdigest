import { Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import "./App.css";
import Header from "./components/Header";
import PostDetailScreen from "./screens/PostDetailScreen";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import SubredditScreen from "./screens/SubredditScreen";
import LogInScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import ProfileSettingsScreen from "./screens/ProfileSettingsScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ResetPasswordConfirmScreen from "./screens/ResetPasswordConfirmScreen";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import PrivateOnlyRoute from "./components/PrivateOnlyRoute";
import ScrollToTop from "./components/ScrollToTop";

import authService from "./services/auth";
import { updateUserSubscriptions } from "./store/userSlice";

function App() {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        authService.verifyAccessToken();
        console.info("dispatch(updateUserSubscriptions());");
        dispatch(updateUserSubscriptions());
    }, [dispatch]);

    return (
        <>
            <Header />
            <main>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomeScreen tabIndex={0} />} />
                    <Route path="/reddit" element={<HomeScreen tabIndex={0} />} />
                    <Route path="/hackernews" element={<HomeScreen tabIndex={1} />} />
                    <Route path="/privacy" element={<PrivacyPolicyScreen />} />
                    <Route path="/about" element={<AboutUsScreen />} />
                    <Route
                        path="/login"
                        element={
                            <PublicOnlyRoute>
                                <LogInScreen />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicOnlyRoute>
                                <SignUpScreen />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path="/reset-password"
                        element={
                            <PublicOnlyRoute>
                                <ResetPasswordScreen />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path="/reset-password-confirmation/:userID/:resetToken"
                        element={
                            <PublicOnlyRoute>
                                <ResetPasswordConfirmScreen />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path="/settings/profile"
                        element={
                            <PrivateOnlyRoute>
                                <ProfileSettingsScreen />
                            </PrivateOnlyRoute>
                        }
                    />
                    <Route path="/reddit/subreddits/:subreddit" element={<SubredditScreen />} />
                    <Route path="/:app/posts/:id" element={<PostDetailScreen />} />
                </Routes>
            </main>
            {!["/login", "/signup", "/reset-password"].includes(location.pathname) && <Footer />}
        </>
    );
}

export default App;
