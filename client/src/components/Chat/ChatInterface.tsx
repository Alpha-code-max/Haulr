import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageSquare } from "react-icons/fi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'vendor' | 'hauler' | 'customer' | 'system';
}

interface ChatInterfaceProps {
  deliveryId: string;
  currentUserType: 'vendor' | 'hauler' | 'customer';
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ deliveryId, currentUserType, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'System', 
      content: 'Chat started for this delivery.', 
      timestamp: new Date(), 
      type: 'system' 
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1),
      content: newMessage.trim(),
      timestamp: new Date(),
      type: currentUserType
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isOwnMessage = (type: string) => type === currentUserType;

  const getMessageBubbleStyle = (type: string) => {
    if (isOwnMessage(type)) {
      return "bg-blue-600 text-white ml-auto";
    }
    if (type === 'system') {
      return "bg-slate-100 text-slate-500 mx-auto text-center text-xs max-w-[80%]";
    }
    return "bg-slate-100 text-slate-900 ";
  };

  return (
    <div className="flex flex-col h-[560px] bg-white rounded-3xl overflow-hidden border border-slate-200">
      {/* Minimalist Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
            <FiMessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Delivery Chat</h3>
            <p className="text-xs text-slate-500">
              Delivery #{deliveryId.slice(-6)}
            </p>
          </div>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <FiX className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${isOwnMessage(message.type) ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${getMessageBubbleStyle(message.type)}`}
              >
                {!isOwnMessage(message.type) && message.type !== 'system' && (
                  <p className="text-xs opacity-75 mb-1 font-medium">
                    {message.sender}
                  </p>
                )}
                <p>{message.content}</p>
                <p className="text-[10px] opacity-60 mt-2 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-5 border-t border-slate-200 bg-white">
        <div className="flex gap-3">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-2xl py-6 text-base"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="h-12 w-12 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 transition-all"
          >
            <FiSend className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-3">
          Messages are end-to-end encrypted
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;