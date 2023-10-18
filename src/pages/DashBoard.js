import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { io } from "socket.io-client";
// import axios from "axios";

const server = process.env.REACT_APP_SERVER;
//console.log(server);

export const DashBoard = () => {
  // const { id } = useParams();
  // const navigate = useNavigate();
  const [status, setStatus] = useState("Waiting");
  const [connection, setConnection] = useState("Disconnected");
  const [message, setMessage] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    setSocket(io(`${server}`));
  };

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(()=>{
    socket?.on("conn", ()=>{
      console.log("Connection Successful");
      setStatus("Connected");
    })

    socket?.on("disconn", ()=>{

      setConnection("New");
      setStatus("Disconneted");
    })

    socket?.on("chat", (msgData)=>{
      setMsgList((prev) => [...prev, msgData]);
    })

  }, [socket]);

  const changeConnection = () => {
    if (connection === "Disconnected") {
      socket?.emit("disconn")
      setMsgList([]);
      setConnection("New");
    } else {
      socket?.emit("new");
      setMsgList([]);
      setStatus("Waiting");
      setConnection("Disconnected");
    }
  };

  const handleMessage = event => {
    // console.log(event.key);
    if(event.key === 'Enter') {
      // console.log("called");
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message !== "") {
      const msgData = {
        content: message,
        sender: socket?.id,
      };
      setMsgList((prev) => [...prev, msgData]);
      socket.emit("chat", msgData);
      setMessage("");
    }
  };

  return (
    <div className="w-screen flex">
      <div className="w-screen h-screen bg-white flex flex-col items-center">
        <div className=" w-[20%] bg-primary h-[70px] my-5 rounded-full flex items-center px-14">
          <h3 className="text-lg font-bold">{status}</h3>
        </div>
        <div className="h-[80%] w-full overflow-y-auto shadow-sm">
          <div className="p-5">
            {msgList?.length > 0 ? (
              msgList.map((msg) => {
                return (
                  <>
                    <div
                      className={`max-w-[40%] rounded-b-xl p-3 mb-2 ${
                        msg.sender === socket?.id
                          ? "bg-primary text-white rounded-tl-xl ml-auto"
                          : "bg-primary text-white rounded-tr-xl"
                      } `}
                    >
                      {msg.content}
                    </div>
                  </>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                Start Conversation
              </div>
            )}
          </div>
        </div>
        <div className="p-6 w-full flex items-center">
          <div
            className={`w-[15%] bg-light font-bold mr-4 p-4 border-0 rounded-full cursor-pinter ${
              status === "Waiting" && "pointer-events-none"
            } `}
            onClick={() => changeConnection()}
          >
            {connection}
          </div>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            onKeyDown={handleMessage}
            className="w-[90%]"
            inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
          />
          <div
            className={`ml-4 p-2 cursor-pointer bg-light rounded-full  ${
              (!message || status==="Waiting" || status==="Disconnected") && "pointer-events-none"
            }`}
            onClick={() => sendMessage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-send"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="10" y1="14" x2="21" y2="3" />
              <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
