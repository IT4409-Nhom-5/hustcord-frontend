import { useState } from 'react'
import './App.css'
import {
  HashtagIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  MicrophoneIcon,
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import {
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

interface Message {
  id: number
  author: string
  timestamp: string
  content: string
  avatar: string
  isEdited?: boolean
}

function App() {
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null)

  const messages: Message[] = [
    {
      id: 1,
      author: '67',
      timestamp: 'Today at 16:46',
      content: 'testing123',
      avatar: 'bg-blue-500',
    },
    {
      id: 2,
      author: '43',
      timestamp: 'Today at 16:47',
      content: 'hi',
      avatar: 'bg-red-500',
      isEdited: true,
    },
    {
      id: 3,
      author: '67',
      timestamp: 'Today at 16:48',
      content: '67 > 43',
      avatar: 'bg-blue-500',
    },
    {
      id: 4,
      author: '43',
      timestamp: 'Today at 16:49',
      content: 'I disagree',
      avatar: 'bg-red-500',
    },
  ]

  const onlineUsers = [
    { id: 1, name: '67', tag: '#0001', avatar: 'bg-blue-500' },
    { id: 2, name: '43', tag: '#0001', avatar: 'bg-red-500' },
  ]

  const channels = ['general', 'epic']

  return (
    <div className="flex h-screen bg-discord-darkest text-discord-lighter">
      {/* Left Server Sidebar */}
      <div className="w-20 bg-discord-darkest flex flex-col items-center py-3 gap-3 border-r border-discord-darker">
        {/* Discord Logo */}
        <button className="w-12 h-12 bg-discord-purple rounded-full flex items-center justify-center hover:rounded-2xl transition-all">
          <span className="text-white font-bold text-lg">D</span>
        </button>

        {/* Server Icons */}
        <button className="w-12 h-12 bg-discord-dark rounded-full hover:rounded-2xl transition-all hover:bg-discord-purple flex items-center justify-center">
          <span className="text-discord-light">T</span>
        </button>

        {/* Divider */}
        <div className="w-8 h-px bg-discord-dark"></div>

        {/* Plus Button */}
        <button className="w-12 h-12 bg-discord-dark rounded-full hover:rounded-2xl transition-all hover:bg-discord-green flex items-center justify-center hover:text-white">
          <PlusIcon className="w-6 h-6" />
        </button>

        {/* Question Mark */}
        <button className="w-12 h-12 bg-discord-dark rounded-full hover:rounded-2xl transition-all hover:bg-discord-purple flex items-center justify-center hover:text-white">
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Left Channel Sidebar */}
      <div className="w-60 bg-discord-darker flex flex-col border-r border-discord-dark">
        {/* Server Name Header */}
        <div className="h-16 bg-discord-darker flex items-center justify-between px-4 border-b border-discord-dark hover:bg-discord-dark transition cursor-pointer">
          <span className="font-bold text-discord-lighter">test</span>
          <ChevronDownIcon className="w-5 h-5 text-discord-light" />
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto py-3 px-2">
          {channels.map((channel) => (
            <div
              key={channel}
              className={`px-3 py-2 rounded cursor-pointer mb-1 flex items-center gap-2 transition ${
                channel === 'general'
                  ? 'bg-discord-dark text-white'
                  : 'text-discord-light hover:text-white hover:bg-discord-dark'
              }`}
            >
              <HashtagIcon className="w-5 h-5" />
              <span>{channel}</span>
            </div>
          ))}
        </div>

        {/* User Info Bottom Bar */}
        <div className="h-14 bg-discord-dark flex items-center justify-between px-3 border-t border-discord-darker">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">43</div>
            <div className="text-xs">
              <div className="font-semibold text-discord-lighter">43 #0001</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="hover:text-discord-green transition">
              <MicrophoneIcon className="w-5 h-5 line-through opacity-60" />
            </button>
            <button className="hover:text-discord-green transition">
              <SpeakerXMarkIcon className="w-5 h-5 line-through opacity-60" />
            </button>
            <button className="hover:text-discord-green transition">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-discord-dark">
        {/* Channel Header */}
        <div className="h-16 bg-discord-dark flex items-center px-6 border-b border-discord-darker">
          <HashtagIcon className="w-6 h-6 text-discord-light mr-3" />
          <span className="font-bold text-discord-lighter text-lg">general</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-discord-darker rounded-full flex items-center justify-center mb-4">
              <HashtagIcon className="w-8 h-8 text-discord-light" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to #general!</h2>
            <p className="text-discord-light">This is the start of the #general channel.</p>
          </div>

          {/* Messages */}
          <div className="space-y-4 flex-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex gap-4 group hover:bg-discord-darker/50 px-3 py-2 rounded transition cursor-pointer"
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 ${message.avatar} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {message.author}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-white">{message.author}</span>
                    <span className="text-xs text-discord-light">{message.timestamp}</span>
                    {message.isEdited && (
                      <span className="text-xs text-discord-light italic">(edited message)</span>
                    )}
                  </div>
                  <p className="text-discord-lighter break-words">{message.content}</p>
                </div>

                {/* Action Buttons */}
                {hoveredMessageId === message.id && (
                  <div className="flex gap-2 opacity-100 transition">
                    <button className="p-2 hover:bg-discord-dark rounded transition">
                      <PencilIcon className="w-4 h-4 text-discord-light hover:text-white" />
                    </button>
                    <button className="p-2 hover:bg-discord-dark rounded transition">
                      <TrashIcon className="w-4 h-4 text-discord-light hover:text-discord-red" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input Area */}
        <div className="px-6 pb-6 pt-4">
          <div className="bg-discord-darker rounded-lg px-4 py-3 flex items-center gap-3 border border-discord-dark hover:border-discord-purple transition">
            <input
              type="text"
              placeholder="Message #general"
              className="flex-1 bg-transparent text-discord-lighter placeholder-discord-light outline-none"
            />
          </div>
        </div>
      </div>

      {/* Right Online Users Sidebar */}
      <div className="w-72 bg-discord-darker border-l border-discord-dark flex flex-col">
        {/* Online Header */}
        <div className="h-12 flex items-center px-4 border-b border-discord-dark">
          <span className="text-xs font-bold text-discord-light uppercase tracking-wider">
            Online — {onlineUsers.length}
          </span>
        </div>

        {/* Online Users List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {onlineUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-2 rounded hover:bg-discord-dark transition cursor-pointer">
              <div className={`w-8 h-8 ${user.avatar} rounded-full flex items-center justify-center text-xs font-bold text-white relative`}>
                {user.name}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-discord-green rounded-full border-2 border-discord-darker"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-discord-lighter truncate">
                  {user.name} <span className="text-discord-light">{user.tag}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
