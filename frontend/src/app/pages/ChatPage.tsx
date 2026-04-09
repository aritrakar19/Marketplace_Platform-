import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, Lock, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { toast } from 'sonner';

export default function ChatPage() {
  const { currentUser, userData } = useAuth();
  const { sendMessage, onMessage } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real conversations
  useEffect(() => {
    const fetchChatPartners = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('http://localhost:5000/api/chat', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          const partners = data.data.map((conv: any) => ({
            id: conv._id,
            partnerId: conv.partnerId,
            name: conv.partnerName,
            lastMessage: conv.lastMessage || 'Start chatting...',
            time: new Date(conv.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: conv.partnerImage,
            online: true,
          }));
          setConversations(partners);
          if (partners.length > 0) setSelectedConversation(partners[0]);
        }
      } catch (error) {
        console.error('Error fetching chat partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatPartners();
  }, [currentUser]);

  // Fetch real chat history when conversation selected
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser || !selectedConversation) return;
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(`http://localhost:5000/api/chat/${selectedConversation.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setChatMessages(data.data);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchHistory();
  }, [currentUser, selectedConversation]);

  // Handle incoming sockets
  useEffect(() => {
    const cleanup = onMessage((msg: any) => {
      if (selectedConversation && (msg.senderId === selectedConversation.partnerId || msg.senderId === currentUser?.uid)) {
        setChatMessages((prev) => [...prev, {
          id: Date.now(),
          sender: msg.senderId === currentUser?.uid ? 'me' : 'them',
          content: msg.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    });
    return cleanup;
  }, [selectedConversation, currentUser, onMessage]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedConversation && currentUser) {
      // Send real-time socket
      sendMessage(selectedConversation.partnerId, messageInput);
      
      // Persist to DB
      try {
        const token = await currentUser.getIdToken();
        await fetch(`http://localhost:5000/api/chat/${selectedConversation.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: messageInput })
        });
      } catch (error) {
        console.error('Failed to persist message', error);
      }

      // Optimistically add to UI
      setChatMessages((prev) => [...prev, {
        id: Date.now() + Math.random(),
        sender: 'me',
        content: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="dashboard" />

      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search conversations..."
                className="pl-9 h-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Loading...</p>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setChatMessages([]); // Clear for new partner in this simplified demo
                  }}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedConversation?.partnerId === conversation.partnerId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm truncate">
                        {conversation.name}
                      </span>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <Lock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No accepted invites found. You can only chat after an invite is accepted.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{selectedConversation.name}</div>
                    <div className="text-xs text-gray-500">
                      {selectedConversation.online ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length > 0 ? chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-400 mt-10">No messages yet. Say hi!</p>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="pr-10 h-11"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                    size="icon"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
              <p className="text-gray-500 max-w-xs">
                You can only chat with users who have accepted your invite or whose invite you have accepted.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
