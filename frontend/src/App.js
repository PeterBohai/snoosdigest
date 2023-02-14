import { Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import "./App.css";
import Header from "./components/Header";
import PostDetailScreen from "./screens/PostDetailScreen";
import Footer from "./components/Footer";
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
import HomeScreenReddit from "./screens/HomeScreenReddit";
import HomeScreenHackernews from "./screens/HomeScreenHackernews";

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
                    <Route path="/" element={<HomeScreenReddit />} />
                    <Route path="/reddit" element={<HomeScreenReddit />} />
                    <Route path="/hackernews" element={<HomeScreenHackernews />} />
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
