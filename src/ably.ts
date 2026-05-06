import Ably from "ably";

localStorage.setItem('uuid', localStorage.getItem('uuid') ?? crypto.randomUUID());

const client = new Ably.Realtime({
  key: import.meta.env.VITE_ABLY_API_KEY as string,
  clientId: localStorage.getItem('uuid'),
});

export default client;

