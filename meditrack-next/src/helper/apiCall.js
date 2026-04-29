import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";

axios.defaults.baseURL = getApiBaseUrl();
axios.defaults.withCredentials = true;

const fetchData = async (url) => {
  const { data } = await axios.get(url);
  return data.data; // Return the inner data object since we use { success: true, data: [...] }
};

export default fetchData;
