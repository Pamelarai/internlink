import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const Messages = ({ initialContact }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
      return res.data;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      const currentConversations = await loadConversations();
      if (initialContact) {
        const existing = currentConversations.find(c => c.contact.id === initialContact.id);
        if (existing) {
          setActiveChat(existing);
        } else {
          const tempConv = {
            contact: initialContact,
            lastMessage: { content: 'Start a conversation...', createdAt: new Date() }
          };
          setActiveChat(tempConv);
          setConversations(prev => {
            if (prev.find(c => c.contact.id === initialContact.id)) return prev;
            return [tempConv, ...prev];
          });
        }
      }
      setIsLoading(false);
    };
    init();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [initialContact]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.contact.id);
      const interval = setInterval(() => loadMessages(activeChat.contact.id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (otherUserId) => {
    try {
      const res = await api.get(`/messages/conversation/${otherUserId}`);
      setMessages(res.data);
      // Mark as read
      await api.put(`/messages/read/${otherUserId}`);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const res = await api.post('/messages/send', {
        receiverId: activeChat.contact.id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chats...</div>;
  }

  return (
    <div className="flex h-[600px] bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-blue-100 flex flex-col">
        <div className="p-4 border-b border-blue-100 bg-blue-50/50">
          <h2 className="text-xl font-bold text-blue-900">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm italic">
              No conversations yet. Start one from an application or profile!
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.contact.id}
                onClick={() => setActiveChat(conv)}
                className={`w-full p-4 flex items-center gap-3 border-b border-blue-50 transition-colors hover:bg-blue-50/50 ${activeChat?.contact.id === conv.contact.id ? 'bg-blue-50' : ''}`}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {(conv.contact.internProfile?.fullName || conv.contact.providerProfile?.companyName || conv.contact.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-blue-900 truncate">
                      {conv.contact.internProfile?.fullName || conv.contact.providerProfile?.companyName || conv.contact.email}
                    </h3>
                    <span className="text-[10px] text-gray-400">
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
                </div>
                {conv.lastMessage.receiverId === user.id && !conv.lastMessage.isRead && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-blue-100 bg-white flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(activeChat.contact.internProfile?.fullName || activeChat.contact.providerProfile?.companyName || activeChat.contact.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">
                    {activeChat.contact.internProfile?.fullName || activeChat.contact.providerProfile?.companyName}
                  </h3>
                  <p className="text-xs text-blue-500 tracking-wider font-medium uppercase">
                    {activeChat.contact.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.senderId === user.id
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none border border-blue-50'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1.5 opacity-60 flex items-center gap-1 ${msg.senderId === user.id ? 'justify-end' : ''}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.senderId === user.id && (
                        <span>{msg.isRead ? '••' : '•'}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-blue-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md shadow-blue-100"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mb-4">💬</div>
            <h3 className="text-xl font-black text-blue-900 mb-2">Select a Conversation</h3>
            <p className="text-gray-500 max-w-xs">Connect with recruiters and candidates to finalize your internship details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
