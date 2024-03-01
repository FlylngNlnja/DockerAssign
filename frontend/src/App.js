import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from "./Pages/LoginForm";
import MainPage from "./Pages/MainPage";
function App() {
  return (
      <div className="App">
            <Routes>
              <Route exact path="/" element={<LoginForm/>}/>
                <Route exact path="/MainPage" element={<MainPage/>}/>
            </Routes>
      </div>
  );
}

export default App;
