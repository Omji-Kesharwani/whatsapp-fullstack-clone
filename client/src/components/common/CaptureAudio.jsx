import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";



function CaptureAudio({hide}) {
  const [{userInfo,currentChatUser,socket},dispatch]=useStateProvider();
  const [isRecording,setIsRecording]=useState(false);
  const [recordedAudio,setRecordedAudio]=useState(null);
  const [waveform,setWaveForm]=useState(null);
  const [recordingDuration,setRecordingDuration]=useState(0);
  const [currentPlayBackTime,setcurrentPlayBackTime]=useState(0);
  const [totalDuration,setTotalDuration]=useState(0);
  const [isPlaying,setIsPlaying]=useState(false);
  const [renderAudio,setRenderAudio]=useState(null);

  const audioRef=useRef(null);  
  const mediaRecoderRef=useRef(null);  
  const waveformRef=useRef(null); 

  useEffect(()=>{
    let interval;
    if(isRecording)
    {
      interval=setInterval(()=>{
      setRecordingDuration((prevDuration)=>{
        setTotalDuration(prevDuration+1);
        return prevDuration+1;
      });
      },1000);
  }
  return ()=>{
    clearInterval(interval);
  };
},[isRecording]);

  useEffect(()=>{
    const wavesurfer=WaveSurfer.create({
      container:waveformRef.current,
      waveColor:"#ccc",
      progressColor:"#4a9eff",
      cursorColor:"#7ae3c3",
      barWidth:2,
      height:30,
      responsive:true,

    });
    setWaveForm(wavesurfer)

    wavesurfer.on("finish",()=>{
      setIsPlaying(false);
    });

    return ()=>{
      wavesurfer.destroy();
    };
  },[]);

  useEffect(()=>{
    if(waveform) handleStartRecording();
  },[waveform]);
 
  const handleStartRecording=()=>{
  
    setRecordingDuration(0);
    setcurrentPlayBackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
    const mediaRecorder=new MediaRecorder(stream);
    mediaRecoderRef.current =mediaRecorder;
    audioRef.current.srcObject=stream ;

   const chunks=[];
   mediaRecorder.ondataavailable=(e)=> chunks.push(e.data);
   mediaRecorder.onstop=()=>{
    const blob =new Blob(chunks, {type:"audio/ogg ; codecs=opus"});
    const audioURL=URL.createObjectURL(blob);
    const audio =new Audio(audioURL);
    setRecordedAudio(audio);
    waveform.load(audioURL);
   };
   mediaRecorder.start();

    }).catch(error=>{
      console.error("Error accessing microphone:" ,error);
    })
  };
  const handleStopRecording=()=>{
   
    if(mediaRecoderRef.current && isRecording)
    {
      mediaRecoderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks=[];
      mediaRecoderRef.current.addEventListener("dataavailable",(event)=>{
        audioChunks.push(event.data);
      });
      mediaRecoderRef.current.addEventListener("stop",()=>{
        const audioBlob =new Blob(audioChunks,{type: "audio/mp3"});
        const audioFile=new File([audioBlob],"recording.mp3");
        setRenderAudio(audioFile);
      });
    }
  };

  useEffect(()=>{
    if(recordedAudio)
    {
      const updatePlaybackTime=()=>{
        setcurrentPlayBackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate",updatePlaybackTime);
      return()=>{
        recordedAudio.removeEventListener("timeupdate",updatePlaybackTime);
      };
    }
  },[recordedAudio]);
  
  const handlePlayRecording=()=>{

    if(recordedAudio)
    {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording=()=>{
   waveform.stop();
   recordedAudio.pause();
   setIsPlaying(false);
  };
  const sendRecording = async () => {
    if (!renderAudio) {
      console.error("No audio file to send.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("audio", renderAudio);
  
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });
  
      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });
  
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (err) {
      console.error("Error sending recording:", err);
    }
  };
  
  const formatTime=(time)=>{
    if(isNaN(time)) return "00:00";
    const minutes =Math.floor(time/60);
    const seconds=Math.floor(time%60);
    return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
  };



  return <div className="flex text-2xl w-full justify-end items-center">
    <div className="pt-1">
      <FaTrash 
      className="text-panel-header-icon"
      onClick={()=>hide()}
      />
    </div>
    <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">

     {isRecording ?
     (<div className="text-red-500 animate-pulse 2-60 text-center">Recording <span>{recordingDuration}s</span></div>
    ):
    (<div>
      {
        recordedAudio && 
        <>
        {!isPlaying ?
        <FaPlay
         onClick={handlePlayRecording}
        />
        
        :<FaStop
        onClick={handlePauseRecording}
        />
        }
        </>
      }
    </div>
    )} 
    <div className="w-60" ref={waveformRef} hidden={isRecording}/>
    {
      recordedAudio && isPlaying && <span>
          {formatTime(currentPlayBackTime)}
        </span>
      
    }
    {
       recordedAudio && !isPlaying && (<span>
       {formatTime(totalDuration)}
       </span>
       )
    }
    <audio ref={audioRef} hidden />
</div>
    <div className="mr-4">
      {
        !isRecording ?
        <FaMicrophone className="text-red-500 "
          onClick={handleStartRecording}
        />:<FaPauseCircle className="text-red-500"
           onClick={handleStopRecording}
        />
      }
    </div>
    <div>
      <MdSend 
      className="text-panel-header-icon cursor-pointer mr-4 " title="Send" 
      onClick={sendRecording}/>
    </div>
    
  </div>;
}

export default CaptureAudio;
