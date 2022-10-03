import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Contacts from "../Components/Contacts";
import data from "bootstrap/js/src/dom/data";
import { io } from "socket.io-client";
import axios from "axios";
import ChatContainer from "../Components/ChatContainer";
import Welcome from "../Components/Welcome";

export default function Chat() {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    useEffect( () =>{async function verif()   {
        if (!localStorage.getItem("user_secrtkey")) {
            navigate("/login");
        } else {

            // setCurrentUser(
            //     await
            //         localStorage.getItem("user_secrtkey")
            //
            // );
            // const data = await axios.get("http://localhost:9001/profile/"+localStorage.getItem("token"));
            axios.get("http://localhost:9001/profile",{
                'headers': {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }}).then(res=>{
            setCurrentUser(res.data);
            console.log(currentUser);});

        }}
        verif()
    }  , []);
    useEffect(() => {
        if (currentUser) {
            socket.current = io("http://localhost:9001/");
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(  () => {async function getContacts() {
        if (currentUser) {
            console.log(currentUser._id);


            const data = await axios.get("http://localhost:9001/allusers/"+currentUser._id);
            console.log(data);
            setContacts(data.data);

        }
    }
      getContacts()
    } , [currentUser]);
    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };
    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} changeChat={handleChatChange} />
                    {currentChat === undefined ? (
                        <Welcome />
                    ) : (
                        <ChatContainer currentChat={currentChat } socket={socket}  />
                    )}
                </div>
            </Container>
        </>
    );
}

const Container = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  .container {
    height: 90vh;
    width: 80vw;
    background-color: white;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
