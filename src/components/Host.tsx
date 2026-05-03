import {useParams} from "react-router";
import {useHostPeer} from "../hooks/use-peer.ts";
import {useEffect, useState} from "react";

export default function Host() {
  const params = useParams();
  const { send } = useHostPeer(params.room!, console.log);
  const [name, setName] = useState('yeet');
  
  useEffect(() => {
    send(name)
  }, [name, send]);

  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"/>
    </div>
  )
}