import {type RefObject, useEffect, useEffectEvent, useRef, useSyncExternalStore} from "react";
import {type DataConnection, Peer} from "peerjs";


function useLazyRef<T>(init: () => T): RefObject<T> {
  const ref = useRef<T>(null);

  if (ref.current === null) {
    ref.current = init();
  }

  return ref as RefObject<T>;
}

export const usePeer = (hostId?: string) => useLazyRef(() => hostId ? new Peer(hostId) : new Peer());

export function useClientPeer(hostId: string, onMessage: (data: unknown) => void) {
  const peer = usePeer();
  const connRef = useRef<DataConnection>(null);

  const onMessageEffect = useEffectEvent(onMessage);

  useEffect(() => {
    const p = peer.current;

    const setupConnection = () => {
      const conn = p.connect(hostId, {reliable: true});
      const conn2 = p.connect(hostId + '_2', {reliable: true});

      connRef.current = conn;

      conn.on("data", (data) => {
        onMessageEffect(data);
      });

      conn2.on('data', data => onMessageEffect(data))

      conn.on('close', () => {
        // todo: reconnect logic here
        console.log('client', 'connection closed');
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
      });
    };

    if (p.open) {
      setupConnection();
    } else {
      p.on("open", setupConnection);
    }

    return () => {
      connRef.current?.close();
    };
  }, [hostId, peer]);

  function send(data: unknown) {
    connRef.current?.send(data);
  }

  return {
    send
  };
}

export function useHostPeer(hostId: string, onMessage: (data: unknown) => void) {
  const peer = usePeer(hostId);

  const onMessageEffect = useEffectEvent(onMessage);

  useEffect(() => {
    const p = peer.current;

    const setupConnection = () => {
      p.on("connection", (conn) => {
        conn.on("data", (data) => {
          onMessageEffect(data);
        });
      });

      p.on("error", (err) => {
        console.error("Connection error:", err);
      });
    };

    if (p.open) {
      setupConnection();
    } else {
      p.on("open", setupConnection);
    }

    return () => {
      // todo: effects run twice
      // p.destroy();
    };
  }, [hostId, peer]);

  function send(data: unknown) {
    Object
      .values(peer.current.connections)
      .forEach((connection) => connection[0].send(data))
  }

  return {
    send
  };
}

