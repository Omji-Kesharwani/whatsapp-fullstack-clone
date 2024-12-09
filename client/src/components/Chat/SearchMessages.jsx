import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const [{currentChatUser,messages},dispatch]=useStateProvider();
  const [searchMessages,setSearchMessages]=useState([])
  const [searchTerm,setSearchTerm]=useState("");
 
  useEffect(()=>{
  if(searchTerm)
  {
    setSearchMessages(messages.filter(message=>message.type==="text" && message.message.includes(searchTerm)))
  }
  else{
    setSearchMessages([])
  }
  },[searchTerm])



  return <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
    <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
     <IoClose className="cursor-pointer text-icon-lighter text-2xl"
     onClick={()=>dispatch({type:reducerCases.SET_MESSAGE_SEARCH})}
     /> 
     <span>Search Messages</span>
    </div>
    <div className="overflow-auto custom-scrollbar h-full ">
      <div className="flex items-center flex-col w-full">
        <div className="flex px-5 items-center gap-3 h-14 w-full ">
        <div className="bg-panel-header-background flex items-center gap-5 py-1 rounded-lg flex-grow w-full px-3">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Search Messages"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
      </div> 
      </div>
     <span className="mt-10 text-secondary">
      {
        !searchTerm.length &&  `Search for messages with ${currentChatUser.name} `
      }
     </span>
      </div>
      <div className="flex justify-center h-full flex-col">
        {
          searchTerm.length >0 &&  !searchMessages.length &&
           <span className="text-secondary w-full flex justify-center">
          No messages found
           </span>
        }
        <div className="flex flex-col w-full h-full">
           {
            searchMessages.map((message)=>(
            <div className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover -full px-5 border-b-[0.1px] border-secondary py-5 ">
             <div className="text-sm text-secondary">{calculateTime(message.createdAt)}
             </div>
             <div className="text-icon-green">{message.message}</div>
            </div>
            )
            )}
        </div>

      </div>
    </div>
  </div>;
}

export default SearchMessages;
