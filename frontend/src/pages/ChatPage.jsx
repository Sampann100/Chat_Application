import { useEffect, useState } from "react";
import { Flex, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../component/chatPageComponent/Sidebar";
import ChatWindow from "../component/chatPageComponent/ChatWindow";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { chatListActions } from "../../store/chatList";
import { URL } from "../../config";

const ChatPage = () => {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem("userData")) || {};
  const chatList = useSelector((state) => state.chatList);

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${URL}/api/chat`, {
          withCredentials: true,
        });

        dispatch(chatListActions.setChatList(response.data));
      } catch (err) {
        console.log("Error fetching chats:", err);
      }
    };

    fetchChats();

    // Poll every 5 seconds
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const setChatListLocal = (updatedList) => {
    dispatch(chatListActions.setChatList(updatedList));
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex h="100vh" bg="#1A202C" color="white">
      {isMobile ? (
        selectedChat ? (
          <ChatWindow
            isMobile={isMobile}
            onBack={() => setSelectedChat(null)}
            selectedChat={selectedChat}
            currentUser={currentUser}
          />
        ) : (
          <Sidebar
            chatList={chatList}
            setChatList={setChatListLocal}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            currentUser={currentUser}
          />
        )
      ) : (
        <>
          <Sidebar
            chatList={chatList}
            setChatList={setChatListLocal}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            currentUser={currentUser}
          />
          <ChatWindow
            isMobile={isMobile}
            onBack={() => setSelectedChat(null)}
            selectedChat={selectedChat}
            currentUser={currentUser}
          />
        </>
      )}
    </Flex>
  );
};

export default ChatPage;
