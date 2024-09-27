import React, { useState, useRef, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import {
  Search,
  MoreVertical,
  Paperclip,
  Image,
  Smile,
  Mic,
  Send,
  X,
  StopCircle,
} from "lucide-react";
import MembersModal from "./MembersModal";
import ProductGrid from "./ProductCard";
import EmojiPicker from "emoji-picker-react"; // Corrected import statement

const socket = io("http://localhost:8000"); // Replace with your server's URL

const ForumChatModel = () => {
  const [activeTab, setActiveTab] = useState("Chats");
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, []);

  const handleFileChange = useCallback((event, type) => {
    const file = event.target.files[0];
    if (file) {
      setAttachment({ file, type });
    }
  }, []);

  const handleRemoveAttachment = useCallback(() => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  }, []);

  // Update the handleEmojiClick function
  const handleEmojiClick = useCallback((event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  }, []);

  const handleRecordToggle = useCallback(() => {
    setIsRecording((prev) => !prev);
    // In a real application, you would start/stop actual audio recording here
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() || attachment) {
      const newMessage = {
        user: "You", // Replace with the actual user if needed
        text: message,
        attachment: attachment ? attachment.file.name : null, // Adjust based on how you store attachments
      };

      // Emit the message through socket.io
      socket.emit("message", newMessage);

      // Send the message to the Express server to save it in the database
      try {
        const response = await fetch("http://localhost:8000/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        if (!response.ok) {
          throw new Error("Failed to save message"); // Throw error if response is not ok
        }
      } catch (error) {
        console.error("Error sending message to server:", error); // Log error
      }

      // Reset the message input and attachment
      setMessage("");
      handleRemoveAttachment();
    }
  }, [message, attachment, handleRemoveAttachment]);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "Chats":
        return (
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.user === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 ${
                    msg.user === "You" ? "bg-blue-100" : "bg-white"
                  } rounded-lg p-3 shadow`}
                >
                  {msg.user !== "You" && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      <span className="font-semibold">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case "Products / Services":
        return <ProductGrid />;
      case "Participants":
        return <MembersModal />;
      default:
        return null;
    }
  }, [activeTab, messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-poppins">
      {/* Header */}
      <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-800">
            <span className="text-xl font-bold">F</span>
          </div>
          <div>
            <h1 className="font-bold">Forum Name</h1>
            <p className="text-xs">Surya, Hari, Jai, Swami ...</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex  ">
        {["Chats", "Products / Services", "Participants"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 px-4 ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {renderContent()}

      {/* Message Input (only show for Chats tab) */}
      {activeTab === "Chats" && (
        <div className="bg-white border-t p-4">
          <div className="flex flex-col space-y-2">
            {attachment && (
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                {attachment.type === "file" ? (
                  <Paperclip className="w-4 h-4 text-gray-500" />
                ) : (
                  <Image className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-700">
                  {attachment.file.name}
                </span>
                <button
                  onClick={handleRemoveAttachment}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a new message ..."
                className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, "file")}
                className="hidden"
              />
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => handleFileChange(e, "image")}
                className="hidden"
              />
              <button
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                onClick={() => fileInputRef.current.click()}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                onClick={() => imageInputRef.current.click()}
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                onClick={handleSendMessage}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-20 right-10">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  skinTonesDisabled={true}
                  height={400}
                  width={300}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumChatModel;

// import React, { useState, useRef } from "react";
// import {
//   Search,
//   MoreVertical,
//   Paperclip,
//   Image,
//   Smile,
//   Mic,
//   Send,
//   X,
//   StopCircle,
// } from "lucide-react";

// const ForumChatModel = () => {
//   const [activeTab, setActiveTab] = useState("Chats");
//   const [attachment, setAttachment] = useState(null);
//   const [message, setMessage] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);

//   const dummyMessages = [
//     {
//       id: 1,
//       user: "Jane Smith",
//       time: "10:14 PM",
//       text: "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra a quam quis gravida. Aliquam purus tempor egestas mauris ornare et faucibus. Scelerisque non ut accumsan dignissim ultrices semper aliquam aliquam ultrices. Felis curabitur habitant lacus tortor eget nisl porttitor. Varius eget praesent risus sit.",
//     },
//     {
//       id: 2,
//       user: "Jane Smith",
//       time: "10:14 PM",
//       text: "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra",
//     },
//     {
//       id: 3,
//       user: "Jennie",
//       time: "10:14 P...",
//       text: "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra a quam quis gravida. Aliquam purus tempor egestas mauris ornare et faucibus. Scelerisque non ut accumsan dignissim ultrices semper aliquam aliquam ultrices.",
//     },
//     {
//       id: 4,
//       user: "You",
//       time: "11:24 PM",
//       text: "Lorem ipsum dolor sit amet consectetur. Nunc arcu metus viverra a quam quis gravida. Aliquam purus tempor egestas mauris ornare et faucibus. Scelerisque non ut accumsan dignissim ultrices semper ultrices.",
//     },
//   ];

//   const handleFileChange = (event, type) => {
//     const file = event.target.files[0];
//     if (file) {
//       setAttachment({ file, type });
//     }
//   };

//   const handleRemoveAttachment = () => {
//     setAttachment(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     if (imageInputRef.current) imageInputRef.current.value = "";
//   };

//   const handleEmojiClick = (emoji) => {
//     setMessage((prevMessage) => prevMessage + emoji);
//     setShowEmojiPicker(false);
//   };

//   const handleRecordToggle = () => {
//     setIsRecording(!isRecording);
//     // In a real application, you would start/stop actual audio recording here
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Chats":
//         return (
//           <div className="flex-grow overflow-y-auto p-4 space-y-4">
//             {dummyMessages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${
//                   message.user === "You" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-3/4 ${
//                     message.user === "You" ? "bg-blue-100" : "bg-white"
//                   } rounded-lg p-3 shadow`}
//                 >
//                   {message.user !== "You" && (
//                     <div className="flex items-center space-x-2 mb-1">
//                       <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
//                       <span className="font-semibold">{message.user}</span>
//                       <span className="text-xs text-gray-500">
//                         {message.time}
//                       </span>
//                     </div>
//                   )}
//                   <p className="text-sm">{message.text}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         );
//       case "Products / Services":
//         return (
//           <div className="flex-grow p-4">
//             <h2 className="text-xl font-bold mb-4">Products / Services</h2>
//             <p>This is where you would display products or services.</p>
//           </div>
//         );
//       case "Participants":
//         return (
//           <div className="flex-grow p-4">
//             <h2 className="text-xl font-bold mb-4">Participants</h2>
//             <ul>
//               <li>Surya</li>
//               <li>Hari</li>
//               <li>Jai</li>
//               <li>Swami</li>
//             </ul>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   // Simple emoji picker component
//   const EmojiPicker = ({ onEmojiClick }) => {
//     const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🎉"];
//     return (
//       <div className="absolute bottom-16 right-0 bg-white p-2 rounded shadow-lg">
//         {emojis.map((emoji) => (
//           <button
//             key={emoji}
//             className="p-1 text-2xl hover:bg-gray-100 rounded"
//             onClick={() => onEmojiClick(emoji)}
//           >
//             {emoji}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-poppins">
//       {/* Header */}
//       <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-800">
//             <span className="text-xl font-bold">F</span>
//           </div>
//           <div>
//             <h1 className="font-bold">Forum Name</h1>
//             <p className="text-xs">Surya, hari, jai, swami ...</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Search className="w-5 h-5" />
//           <MoreVertical className="w-5 h-5" />
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex border-b">
//         {["Chats", "Products / Services", "Participants"].map((tab) => (
//           <button
//             key={tab}
//             className={`flex-1 py-2 px-4 ${
//               activeTab === tab
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Content Area */}
//       {renderContent()}

//       {/* Message Input (only show for Chats tab) */}
//       {activeTab === "Chats" && (
//         <div className="bg-white border-t p-4">
//           <div className="flex flex-col space-y-2">
//             {attachment && (
//               <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
//                 {attachment.type === "file" ? (
//                   <Paperclip className="w-4 h-4 text-gray-500" />
//                 ) : (
//                   <Image className="w-4 h-4 text-gray-500" />
//                 )}
//                 <span className="text-sm text-gray-700">
//                   {attachment.file.name}
//                 </span>
//                 <button
//                   onClick={handleRemoveAttachment}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a new message ..."
//                 className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={(e) => handleFileChange(e, "file")}
//                 className="hidden"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={imageInputRef}
//                 onChange={(e) => handleFileChange(e, "image")}
//                 className="hidden"
//               />
//               <button
//                 className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
//                 onClick={() => fileInputRef.current.click()}
//               >
//                 <Paperclip className="w-5 h-5" />
//               </button>
//               <button
//                 className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
//                 onClick={() => imageInputRef.current.click()}
//               >
//                 <Image className="w-5 h-5" />
//               </button>
//               <div className="relative">
//                 <button
//                   className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 >
//                   <Smile className="w-5 h-5" />
//                 </button>
//                 {showEmojiPicker && (
//                   <EmojiPicker onEmojiClick={handleEmojiClick} />
//                 )}
//               </div>
//               <button
//                 className={`p-2 ${
//                   isRecording ? "text-red-600" : "text-blue-600"
//                 } hover:bg-blue-100 rounded-full`}
//                 onClick={handleRecordToggle}
//               >
//                 {isRecording ? (
//                   <StopCircle className="w-5 h-5" />
//                 ) : (
//                   <Mic className="w-5 h-5" />
//                 )}
//               </button>
//               <button className="p-2 bg-blue-600 text-white rounded-full">
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForumChatModel;
