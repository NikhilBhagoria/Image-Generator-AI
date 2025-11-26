import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Loader, Trash2, Copy } from 'lucide-react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, clearChatHistory, fetchChatHistory, messageSend } from '../store/slices/userSlice.js'

const ChatInterface = () => {
  const dispatch = useDispatch();
  const {chatHistory,loading, error} = useSelector((state) => state.user);
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    dispatch(fetchChatHistory())
  }, [dispatch])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }


  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    dispatch(addMessage(userMessage));
    setInputMessage('')

    dispatch(messageSend({ message: inputMessage, conversationHistory: chatHistory.concat(userMessage) }));
  }

  const clearChat = async () => {
    dispatch(clearChatHistory());
    
      // setMessages([])
      setInputMessage('')
  }

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Chat Assistant</h1>
            <p className="text-sm text-gray-600">Powered by OpenAI GPT</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-600">Ask me anything! I'm here to help.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-3`}
            >
              {message.sender === 'ai' && (
                <div className="flex-shrink-0">
                  <Bot className="h-8 w-8 text-blue-500 bg-blue-100 rounded-full p-1" />
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isError
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.sender === 'ai' && (
                    <button
                      onClick={() => copyMessage(message.text)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-gray-500 bg-gray-100 rounded-full p-1" />
                </div>
              )}
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start items-start space-x-3">
            <div className="flex-shrink-0">
              <Bot className="h-8 w-8 text-blue-500 bg-blue-100 rounded-full p-1" />
            </div>
            <div className="bg-white text-gray-800 shadow-sm max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin text-blue-500" />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
