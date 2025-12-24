// src/App.jsx
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, MessageSquare, History, X } from 'lucide-react';
import ChatInterface from './chatInterface';
import HistoryPage from './historyPage';

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);

const App = () => {
  // 1. Initialize from Local Storage with Error Handling
  const [savedChats, setSavedChats] = useState(() => {
    try {
      const saved = localStorage.getItem('soul_ai_chats');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing history:", error);
      return [];
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 3. The Add Function with Debugging Log
  const addChat = (chatData) => {
    console.log("📝 Adding new chat to history:", chatData); // <--- CHECK CONSOLE FOR THIS
    setSavedChats((prev) => {
      const newChats = [chatData, ...prev];
      localStorage.setItem('soul_ai_chats', JSON.stringify(newChats));
      return newChats;
    });
  };

  return (
    <AppContext.Provider value={{ savedChats, addChat }}>
      <Router>
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
          
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed md:relative z-30 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          `}>
            <div className="p-4 flex items-center justify-between border-b">
              <Link to="/" className="flex items-center gap-2 font-bold text-purple-700 text-xl">
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">AI</div>
                <span>Bot AI</span>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                <X size={24} />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-gray-700 font-medium">
                <MessageSquare size={20} />
                New Chat
              </Link>
              <Link to="/history" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-gray-700 font-medium">
                <History size={20} />
                Past Conversations
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-full w-full">
            <header className="bg-white p-4 shadow-sm flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} className="text-gray-600" />
              </button>
              <h1 className="font-bold text-purple-700 text-lg">Bot AI</h1>
            </header>

            <div className="flex-1 overflow-hidden relative">
              <Routes>
                <Route path="/" element={<ChatInterface />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;