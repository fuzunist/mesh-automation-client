import axios from "axios";

export const verify = async (access_token) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/user`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const login = async (Username, Password) => {
  try {
    console.log(import.meta.env.VITE_API_ENDPOINT);
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/user/login`,
      { Username, Password }
    );
    return data;
  } catch (e) {
    return e.response.data;
  }
};
