import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          HustCord Ready!
        </h1>
        <p className="text-gray-400 mb-6">
          Tailwind CSS, Redux, Router, Axios, and Socket.io have been successfully installed.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
            <span className="text-blue-400 font-semibold">Tailwind CSS</span>
            <p className="text-xs text-gray-500">Configured & Styled</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
            <span className="text-purple-400 font-semibold">Redux Toolkit</span>
            <p className="text-xs text-gray-500">Store Initialized</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
            <span className="text-green-400 font-semibold">React Router</span>
            <p className="text-xs text-gray-500">Routing Enabled</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
            <span className="text-yellow-400 font-semibold">Socket.io</span>
            <p className="text-xs text-gray-500">Library Installed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
