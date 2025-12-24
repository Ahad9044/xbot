// src/components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { findResponse } from './assets/data'; 
import { useAppContext } from './App';        

const ChatInterface = () => {
  const { addChat } = useAppContext();
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { 
      type: 'user', 
      text: input, 
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    const aiResponseText = findResponse(input);
    
    const aiMsg = { 
      type: 'ai', 
      text: aiResponseText, 
      id: Date.now() + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: null 
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const handleLikeDislike = (msgId, type) => {
    setMessages(prev => prev.map(msg => 
      msg.id === msgId ? { ...msg, likes: type } : msg
    ));
  };

  const handleSaveChat = () => {
    if (messages.length > 0) {
      const chatSession = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        messages: messages,
        rating: 5,
        feedback: ''
      };
      addChat(chatSession);
      alert("History Saved Successfully!");
      setMessages([]);
    } else {
      alert("Please have a conversation before saving!");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white md:bg-gray-50 max-w-5xl mx-auto md:p-6">
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">How Can I Help You Today?</h2>
            <span className="text-3xl font-bold text-purple-600 mt-2">Soul AI</span>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} group`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center 
                ${msg.type === 'user' ? 'bg-purple-600' : 'bg-purple-100'}`}>
                 {msg.type === 'user' ? 
                   <span className="text-white text-xs">You</span> : 
                   <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="AI" className="w-6 h-6" />
                 }
              </div>
              
              <div className="flex flex-col max-w-[80%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-gray-700">
                    {msg.type === 'user' ? 'You' : <span>Soul AI</span>}
                  </span>
                  <span className="text-xs text-gray-400">{msg.timestamp}</span>
                </div>
                
                <div className={`relative p-4 rounded-xl shadow-sm text-sm leading-relaxed
                  ${msg.type === 'user' ? 'bg-purple-100 text-gray-800' : 'bg-white text-gray-800 border border-gray-100'}`}>
                  
                  {msg.type === 'user' ? msg.text : <p>{msg.text}</p>}

                  {msg.type === 'ai' && (
                    <div className="absolute -bottom-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white shadow-md rounded-full px-2 py-1 text-gray-500 border text-xs">
                      <button onClick={() => handleLikeDislike(msg.id, 'up')} className={`hover:text-green-500 ${msg.likes === 'up' ? 'text-green-600' : ''}`}><ThumbsUp size={14} /></button>
                      <button onClick={() => handleLikeDislike(msg.id, 'down')} className={`hover:text-red-500 ${msg.likes === 'down' ? 'text-red-600' : ''}`}><ThumbsDown size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white md:bg-transparent">
        <form onSubmit={handleAsk} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            placeholder="Message Bot AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">Ask</button>
          <button type="button" onClick={handleSaveChat} className="bg-purple-100 text-purple-700 p-3 rounded-lg hover:bg-purple-200 transition-colors shadow-sm font-medium">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;