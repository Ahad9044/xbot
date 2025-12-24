// src/components/HistoryPage.jsx
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAppContext } from './App'; 

const HistoryPage = () => {
  const { savedChats } = useAppContext();
  const [filterRating, setFilterRating] = useState('All');

  const filteredChats = filterRating === 'All' 
    ? savedChats 
    : savedChats.filter(chat => chat.rating === parseInt(filterRating));

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Conversation History</h2>

        <div className="mb-8 flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
          <span className="font-medium text-gray-600">Filter by Rating:</span>
          <div className="flex gap-2">
            <button onClick={() => setFilterRating('All')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterRating === 'All' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
            {[1, 2, 3, 4, 5].map(rating => (
              <button key={rating} onClick={() => setFilterRating(rating)} className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${filterRating === rating ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {rating} <Star size={14} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredChats.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No history found.</div>
          ) : (
            filteredChats.map((chat) => (
              <div key={chat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-purple-50 p-4 flex justify-between items-center border-b border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">
                       {chat.rating}<span className="text-xs">/5</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Chat on {chat.date}</p>
                      <p className="text-xs text-gray-500">Feedback: "{chat.feedback || 'No comments'}"</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < chat.rating ? "currentColor" : "none"} className={i < chat.rating ? "" : "text-gray-300"} />
                    ))}
                  </div>
                </div>

                <div className="p-4 space-y-4 max-h-64 overflow-y-auto bg-gray-50/50">
                  {chat.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-lg text-sm relative group
                        ${msg.type === 'user' ? 'bg-purple-100 text-gray-800' : 'bg-white border text-gray-700'}`}>
                        <p className="font-medium text-xs mb-1 opacity-70">{msg.type === 'user' ? 'You' : 'Soul AI'}</p>
                        <p>{msg.text}</p>
                        {msg.likes && (
                          <div className="absolute -right-2 -bottom-2 bg-white shadow-sm border rounded-full p-1">
                            {msg.likes === 'up' ? <ThumbsUp size={12} className="text-green-600" /> : <ThumbsDown size={12} className="text-red-600" />}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;