import Ably from "ably";

const client = new Ably.Realtime({
  key: import.meta.env.VITE_ABLY_API_KEY as string,
  clientId: crypto.randomUUID(),
});

export default client;

