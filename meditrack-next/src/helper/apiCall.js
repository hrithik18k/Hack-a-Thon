import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";
axios.defaults.withCredentials = true;

const fetchData = async (url) => {
  const { data } = await axios.get(url);
  return data.data; // Return the inner data object since we use { success: true, data: [...] }
};

export default fetchData;
