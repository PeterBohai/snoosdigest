import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import PostDetailScreen from './screens/PostDetailScreen';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import SubredditScreen from './screens/SubredditScreen';

function App() {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path='/' element={<HomeScreen />} />
                    <Route path='/subreddits/:subreddit' element={<SubredditScreen />} />
                    <Route path='/posts/:id' element={<PostDetailScreen />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
