import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Send, Users, UserPlus, Loader2, Copy, LogOut as LeaveIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WebSocketClient } from '../utils/websocket';
import Navbar from '../components/Navbar';

const TeamMode = () => {
  const { roomId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [currentRoomId, setCurrentRoomId] = useState(roomId || '');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('generate');
  const [streaming, setStreaming] = useState(false);
  const [streamingUser, setStreamingUser] = useState(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const [members, setMembers] = useState([]);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  const joinRoom = (room) => {
    wsRef.current = new WebSocketClient(`/ws/team/${room}`, token);
    
    wsRef.current.onMessage((data) => {
      if (data.type === 'user_joined') {
        setMessages((prev) => [
          ...prev,
          {
            type: 'system',
            content: `${data.username} joined the room`,
            timestamp: data.timestamp,
          },
        ]);
        setMembers((prev) => [...new Set([...prev, data.username])]);
      } else if (data.type === 'user_left') {
        setMessages((prev) => [
          ...prev,
          {
            type: 'system',
            content: `${data.username} left the room`,
            timestamp: data.timestamp,
          },
        ]);
        setMembers((prev) => prev.filter((m) => m !== data.username));
      } else if (data.type === 'message') {
        setMessages((prev) => [
          ...prev,
          {
            type: 'user',
            username: data.username,
            content: data.content,
            timestamp: data.timestamp,
            userId: data.user_id,
          },
        ]);
      } else if (data.type === 'ai_start') {
        setStreaming(true);
        setStreamingUser(data.username);
        setCurrentResponse('');
        setMessages((prev) => [
          ...prev,
          {
            type: 'ai_prompt',
            username: data.username,
            content: data.prompt,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else if (data.type === 'ai_chunk') {
        setCurrentResponse((prev) => prev + data.content);
      } else if (data.type === 'ai_complete') {
        setStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            type: 'ai_response',
            content: data.full_response,
            timestamp: new Date().toISOString(),
          },
        ]);
        setCurrentResponse('');
        setStreamingUser(null);
      }
    });

    wsRef.current.connect();
    setJoined(true);
    setCurrentRoomId(room);
    
    if (!roomId) {
      navigate(`/team/${room}`);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (currentRoomId.trim()) {
      joinRoom(currentRoomId);
    }
  };

  const handleSendMessage = () => {
    if (!prompt.trim()) return;

    wsRef.current.send({
      type: 'message',
      content: prompt,
    });

    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        username: user.username,
        content: prompt,
        timestamp: new Date().toISOString(),
        userId: user.id,
        isMe: true,
      },
    ]);

    setPrompt('');
  };

  const handleAIPrompt = () => {
    if (!prompt.trim()) return;

    wsRef.current.send({
      type: 'ai_prompt',
      prompt: prompt,
      mode: mode,
    });

    setPrompt('');
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/team/${currentRoomId}`;
    navigator.clipboard.writeText(link);
    alert('Room link copied to clipboard!');
  };

  const leaveRoom = () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
    setJoined(false);
    setMessages([]);
    setMembers([]);
    navigate('/team');
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="card p-8">
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Team Mode
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate with your team and interact with AI together
              </p>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Room ID
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Enter room ID or create a new one"
                  value={currentRoomId}
                  onChange={(e) => setCurrentRoomId(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Create a unique room ID or use an existing one to join
                </p>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                <UserPlus className="h-5 w-5 mr-2" />
                Join Room
              </button>
            </form>

            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <h3 className="font-semibold text-primary-900 dark:text-primary-300 mb-2">
                How it works:
              </h3>
              <ul className="text-sm text-primary-800 dark:text-primary-400 space-y-1">
                <li>• Create or join a room with a unique ID</li>
                <li>• Share the room link with team members</li>
                <li>• Chat and ask AI questions together in real-time</li>
                <li>• See AI responses streamed live to all members</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Members Sidebar */}
          <div className="lg:col-span-1 card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Room Info</h3>
              <button
                onClick={leaveRoom}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                title="Leave room"
              >
                <LeaveIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Room ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {currentRoomId}
                  </p>
                </div>
                <button
                  onClick={copyRoomLink}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Copy room link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Members ({members.length + 1})
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-primary-50 dark:bg-primary-900/30 rounded">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.username} (You)
                  </span>
                </div>
                {members.map((member, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-2">
                    <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {member}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Mode Selection */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                AI Mode
              </h4>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="input text-sm"
              >
                <option value="generate">Generate</option>
                <option value="debug">Debug</option>
                <option value="explain">Explain</option>
              </select>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 card flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Team Chat & AI Assistant
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => {
                if (msg.type === 'system') {
                  return (
                    <div key={idx} className="text-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                if (msg.type === 'ai_prompt') {
                  return (
                    <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                        {msg.username} asked AI:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{msg.content}</p>
                    </div>
                  );
                }

                if (msg.type === 'ai_response') {
                  return (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-xs text-primary-600 dark:text-primary-400 mb-2 font-semibold">
                        AI Response:
                      </p>
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-gray-800 px-1 rounded text-sm" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        msg.isMe
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      } rounded-lg p-3`}
                    >
                      {!msg.isMe && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {msg.username}
                        </p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                );
              })}

              {streaming && currentResponse && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-xs text-primary-600 dark:text-primary-400 mb-2">
                    AI responding to {streamingUser}...
                  </p>
                  <ReactMarkdown>{currentResponse}</ReactMarkdown>
                </div>
              )}

              {streaming && !currentResponse && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message or ask AI..."
                  className="input flex-1"
                  disabled={streaming}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={streaming || !prompt.trim()}
                  className="btn btn-secondary"
                  title="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
                <button
                  onClick={handleAIPrompt}
                  disabled={streaming || !prompt.trim()}
                  className="btn btn-primary"
                  title="Ask AI"
                >
                  AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMode;
