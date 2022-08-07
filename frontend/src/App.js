import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import './App.css';
import Header from './components/Header';
import PostDetailScreen from './screens/PostDetailScreen';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import SubredditScreen from './screens/SubredditScreen';
import LogInScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import PublicOnlyRoute from './components/PublicOnlyRoute';

import authService from './services/auth';
import { updateUserSubscriptions } from './store/userSlice';


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        authService.verifyAccessToken();
        console.log('dispatch(updateUserSubscriptions());');
        dispatch(updateUserSubscriptions());
    }, [dispatch]);

    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path='/' element={<HomeScreen />} />
                    <Route path='/login' element={
                        <PublicOnlyRoute>
                            <LogInScreen />
                        </PublicOnlyRoute>
                        } 
                    />
                    <Route path='/signup' element={
                        <PublicOnlyRoute>
                            <SignUpScreen />
                        </PublicOnlyRoute>
                        } 
                    />
                    <Route path='/subreddits/:subreddit' element={<SubredditScreen />} />
                    <Route path='/posts/:id' element={<PostDetailScreen />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
