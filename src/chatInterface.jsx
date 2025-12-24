// src/components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, X } from 'lucide-react';

// ✅ Correct Relative Imports:
import { findResponse } from './assets/data'; // Go up to src, then to assets
import { useAppContext } from './App';        // Go up to src, then App.jsx

const ChatInterface = () => {
  const { addChat } = useAppContext();
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
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
    if (messages.length > 0) setShowModal(true);
  };

  const finalizeSave = (rating, feedbackText) => {
    const chatSession = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      messages: messages,
      rating: rating,
      feedback: feedbackText
    };
    addChat(chatSession);
    setMessages([]); 
    setShowModal(false);
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

                  {/* Like/Dislike Buttons */}
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

      {showModal && <FeedbackModal onClose={() => setShowModal(false)} onSave={finalizeSave} />}
    </div>
  );
};

const FeedbackModal = ({ onClose, onSave }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">💡</span> Provide Feedback
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Rate this conversation</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}>
                  <Star fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Additional Comments</label>
            <textarea className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none" placeholder="What did you like or dislike?" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>

          <button onClick={() => onSave(rating, feedback)} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">Submit Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;