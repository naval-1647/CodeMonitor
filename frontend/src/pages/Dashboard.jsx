import { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Send, Loader2, Save, Trash2, Sparkles, Bug, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WebSocketClient } from '../utils/websocket';
import api from '../utils/api';
import Navbar from '../components/Navbar';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [code, setCode] = useState('# Write your code here...\n');
  const [language, setLanguage] = useState('python');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('generate');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/api/ai/history?limit=20');
      setChatHistory(response.data.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }

    wsRef.current = new WebSocketClient('/ws/chat', token);
    
    wsRef.current.onMessage((data) => {
      if (data.type === 'start') {
        setStreaming(true);
        setCurrentResponse('');
      } else if (data.type === 'chunk') {
        setCurrentResponse((prev) => prev + data.content);
      } else if (data.type === 'complete') {
        setStreaming(false);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: currentResponse },
        ]);
        setCurrentResponse('');
        loadChatHistory();
      } else if (data.type === 'error') {
        setStreaming(false);
        setMessages((prev) => [
          ...prev,
          { role: 'error', content: data.message },
        ]);
      }
    });

    wsRef.current.onError((error) => {
      console.error('WebSocket error:', error);
      setStreaming(false);
    });

    wsRef.current.onClose(() => {
      console.log('WebSocket closed, will reconnect on next message');
    });

    wsRef.current.connect();
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    // Connect or reconnect WebSocket if needed
    if (!wsRef.current || !wsRef.current.ws || wsRef.current.ws.readyState !== WebSocket.OPEN) {
      connectWebSocket();
      
      // Wait for connection to establish
      await new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (wsRef.current && wsRef.current.ws && wsRef.current.ws.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            resolve();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkConnection);
          resolve();
        }, 5000);
      });
    }

    // Send the message
    wsRef.current.send({
      prompt: prompt,
      mode: mode,
      code_context: mode !== 'generate' ? code : null,
    });

    setPrompt('');
  };

  const handleSaveSnippet = async () => {
    if (!code.trim()) return;

    try {
      const title = prompt(`Enter snippet title:`);
      if (!title) return;

      await api.post('/api/snippets', {
        title,
        code,
        language,
        description: `Created from dashboard`,
        tags: [language, mode],
      });

      alert('Snippet saved successfully!');
    } catch (error) {
      console.error('Error saving snippet:', error);
      alert('Failed to save snippet');
    }
  };

  const loadHistoryItem = (item) => {
    const lastUserMsg = item.messages.find((m) => m.role === 'user');
    const lastAssistantMsg = item.messages.find((m) => m.role === 'assistant');

    if (lastUserMsg) {
      setMessages([
        { role: 'user', content: lastUserMsg.content },
        { role: 'assistant', content: lastAssistantMsg?.content || '' },
      ]);
    }

    if (item.code_context) {
      setCode(item.code_context);
    }
    setMode(item.mode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Code Editor */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Code Editor
                </h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input py-1 text-sm"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                  <button onClick={handleSaveSnippet} className="btn btn-secondary py-1 text-sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                </div>
              </div>
              <AceEditor
                mode={language}
                theme="monokai"
                value={code}
                onChange={setCode}
                name="code-editor"
                width="100%"
                height="500px"
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 4,
                }}
              />
            </div>

            {/* AI Mode Selection */}
            <div className="card p-4">
              <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">
                AI Mode
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMode('generate')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    mode === 'generate'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">Generate</span>
                </button>
                <button
                  onClick={() => setMode('debug')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    mode === 'debug'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  <Bug className="h-5 w-5" />
                  <span className="text-sm font-medium">Debug</span>
                </button>
                <button
                  onClick={() => setMode('explain')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    mode === 'explain'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm font-medium">Explain</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex flex-col space-y-4">
            {/* Chat History Sidebar */}
            <div className="card p-4 max-h-48 overflow-y-auto">
              <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                Recent Chats
              </h3>
              <div className="space-y-2">
                {chatHistory.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.mode}
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 truncate">
                      {item.messages[0]?.content.substring(0, 40)}...
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="card flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : msg.role === 'error'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
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
                                <code className="bg-gray-800 px-1 rounded" {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {streaming && currentResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <ReactMarkdown>{currentResponse}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {streaming && !currentResponse && (
                  <div className="flex justify-start">
                    <div className="rounded-lg p-3 bg-gray-200 dark:bg-gray-700">
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
                    placeholder={`Ask AI to ${mode} code...`}
                    className="input flex-1"
                    disabled={streaming}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={streaming || !prompt.trim()}
                    className="btn btn-primary"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
