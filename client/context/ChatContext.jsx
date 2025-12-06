import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket, authUser, axios } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Online users
  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    socket.on("getonlineusers", handleOnlineUsers);
    return () => socket.off("getonlineusers", handleOnlineUsers);
  }, [socket]);

  // Fetch users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch chat history
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) setMessages(data.messages || []);
      else setMessages([]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Send message
  const sendMessage = ({ text, image }) => {
    if (!selectedUser || !socket) return;

    // Create optimistic update with temporary ID
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const tempMessage = {
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text,
      image,
      createdAt: new Date().toISOString(),
      _id: tempId,
      isOptimistic: true, // Flag to identify optimistic updates
    };
    setMessages((prev) => [...prev, tempMessage]);

    // Emit to server
    socket.emit("sendMessage", { receiverId: selectedUser._id, text, image });
  };

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      // If this is for the current chat
      if (
        selectedUser &&
        (msg.senderId === selectedUser._id ||
          msg.receiverId === selectedUser._id)
      ) {
        setMessages((prev) => {
          // If this is from the current user (sender), replace optimistic update
          if (msg.senderId === authUser._id) {
            // Remove the optimistic update and add the real message
            const filtered = prev.filter((m) => !m.isOptimistic);
            return [...filtered, msg];
          } else {
            // This is from the other user, just add it
            return [...prev, msg];
          }
        });

        // Mark seen via API if we received the message
        if (msg.receiverId === authUser._id) {
          axios.put(`/api/messages/mark/${msg._id}`).catch(console.error);
        }
      } else {
        // Message for different chat - update unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    };

    const handleMessagesSeen = ({ by }) => {
      setUnseenMessages((prev) => ({
        ...prev,
        [by]: 0,
      }));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, selectedUser, authUser?._id]);

  // Mark as seen when opening chat
  useEffect(() => {
    if (selectedUser && socket) {
      socket.emit("markSeen", { senderId: selectedUser._id });
      setUnseenMessages((prev) => ({ ...prev, [selectedUser._id]: 0 }));
    }
  }, [selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
        unseenMessages,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
