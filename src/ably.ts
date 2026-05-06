import Ably from "ably";

const clientId = localStorage.getItem('uuid') ?? crypto.randomUUID();

localStorage.setItem('uuid', clientId);

const client = new Ably.Realtime({
  key: import.meta.env.VITE_ABLY_API_KEY as string,
  clientId,
});

export default client;

