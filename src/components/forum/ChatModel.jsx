import React, { useState } from "react";
import {
  Users,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Image,
  Mic,
  Send,
} from "lucide-react";

const ChatModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Chats");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Jane Smith",
      time: "10:14 PM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra a quam quis gravida. Aliquam purus tempor egestas mauris ornare et faucibus. Scelerisque non ut accumsan dignissim ultrices semper aliquam aliquam ultrices. Felis curabitur habitant lacus tortor eget nisl porttitor. Varius eget praesent risus sit.",
    },
    {
      id: 2,
      sender: "Jane Smith",
      time: "10:14 PM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra",
    },
    {
      id: 3,
      sender: "Jennie",
      time: "10:14 PM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra a quam quis gravida. Aliquam purus tempor egestas mauris ornare et faucibus. Scelerisque non ut accumsan dignissim ultrices semper aliquam aliquam ultrices.",
    },
    {
      id: 4,
      sender: "You",
      time: "11:24 PM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra a quam quis gravida. Aliquam purus tempor egestas mauris ornare et faucibus. Scelerisque non ut accumsan dignissim ultrices semper ultrices.",
    },
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={onClose}
    >
      <div
        className="relative top-20 mx-auto p-5 border w-11/12 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-[80vh]">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-800 text-white p-4 rounded-t-md">
            <div className="flex items-center space-x-3">
              <Users size={24} />
              <div>
                <h2 className="font-bold">Forum Name</h2>
                <p className="text-sm">Surya, hari, jai, swami...</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Search size={20} />
              <MoreVertical size={20} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {["Chats", "Products / Services", "Participants"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md ${
                    message.sender === "You" ? "bg-blue-100" : "bg-gray-100"
                  } rounded-lg p-3`}
                >
                  {message.sender !== "You" && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                      <span className="font-semibold">{message.sender}</span>
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  {message.sender === "You" && (
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center bg-gray-100 rounded-full p-2">
              <input
                type="text"
                placeholder="Type a new message..."
                className="flex-grow bg-transparent outline-none px-2"
              />
              <div className="flex space-x-2">
                <Paperclip size={20} className="text-gray-500" />
                <Smile size={20} className="text-gray-500" />
                <Image size={20} className="text-gray-500" />
                <Mic size={20} className="text-gray-500" />
                <Send size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
