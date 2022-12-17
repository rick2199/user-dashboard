import axios from "axios";

const authClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_AUTH_API_URL}`,
});

export default authClient;
