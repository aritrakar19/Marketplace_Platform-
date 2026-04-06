import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';

const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    lastMessage: 'Thanks for reaching out! I\'d love to...',
    time: '10:30 AM',
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1615843644216-14d9b92a02ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    online: true,
  },
  {
    id: 2,
    name: 'Marcus Williams',
    lastMessage: 'Let\'s schedule a call to discuss...',
    time: 'Yesterday',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1671518707590-4900d05ad5e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    online: false,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    lastMessage: 'I\'m interested in your campaign...',
    time: 'Monday',
    unread: 1,
    avatar: 'https://images.unsplash.com/photo-1758179761789-87792b6132a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    online: true,
  },
];

const messages = [
  {
    id: 1,
    sender: 'them',
    content: 'Hi! I saw your campaign and I\'m really interested in collaborating.',
    time: '10:25 AM',
  },
  {
    id: 2,
    sender: 'me',
    content: 'That\'s great! I checked out your profile and I think you\'d be a perfect fit.',
    time: '10:27 AM',
  },
  {
    id: 3,
    sender: 'them',
    content: 'Thanks for reaching out! I\'d love to discuss the details. When would be a good time for a call?',
    time: '10:30 AM',
  },
  {
    id: 4,
    sender: 'me',
    content: 'How about tomorrow at 2 PM? I can send you a calendar invite.',
    time: '10:32 AM',
  },
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
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
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation.id === conversation.id ? 'bg-blue-50' : ''
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <Badge className="bg-blue-600 text-white ml-2">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col bg-white">
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
            {messages.map((message) => (
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
            ))}
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
        </main>
      </div>
    </div>
  );
}
