import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import PostDetailScreen from './screens/PostDetailScreen';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import SubredditScreen from './screens/SubredditScreen';
import LogInScreen from './screens/LoginScreen';
import PublicOnlyRoute from './components/PublicOnlyRoute';

function App() {
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
                    <Route path='/subreddits/:subreddit' element={<SubredditScreen />} />
                    <Route path='/posts/:id' element={<PostDetailScreen />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
