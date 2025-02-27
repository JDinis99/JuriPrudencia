import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Anom from './Anom';
import ImportPage from './ImportPage';
import HelpPage from './HelpPage';
import Header from './components/header';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <div className="content">
          <Header/>
          <Routes>
            <Route exact path="/" element={<ImportPage />}/>
            <Route exact path="/anom" element={<Anom />}/>
            <Route exact path="/ajuda" element={<HelpPage />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;