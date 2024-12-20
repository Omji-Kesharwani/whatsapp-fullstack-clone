import { StateProvider } from "@/context/StateContext";
import "@/styles/globals.css";
import { initialState } from "@/context/StateReducers";
import reducer from "@/context/StateReducers";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return(
    <StateProvider initialState={initialState} reducer={reducer}>
     <Head>
      <title>
        Whatsapp
      </title>
      <link rel="shortcut icon"  href="/favicon.png"/>
       </Head>
      <Component {...pageProps} />
    </StateProvider>
  )
  
  
 
}
