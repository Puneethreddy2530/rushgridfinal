import { useState } from 'react';
import { Send, Bot } from 'lucide-react';

interface Message {
  from: 'bot' | 'user';
  text: string;
}

interface RushBotPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function RushBotPanel({ messages, onSendMessage }: RushBotPanelProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-black border-t border-gray-800 p-4 h-64 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-5 h-5 text-[#d50032]" />
        <div>
          <h3 className="font-display text-sm font-bold text-white">RushBot</h3>
          <p className="text-xs text-gray-400">AI Co-Pilot • Powered by PathFuel</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-lg text-sm ${msg.from === 'bot' ? 'bg-[#1a1a1a]' : 'bg-[#d50032]/20'}`}>
            <p className="text-white">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask RushBot or give a command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#d50032]"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-[#d50032] text-white rounded-lg hover:bg-[#b5002a] transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}