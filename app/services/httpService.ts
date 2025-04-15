import axios from "axios";

const service = {
    get: async (url: string, config = {}) => {
        const result = await axios.get(url, config)
        return {
            status: result.status,
            data: result.data
        }

    },
    post: async (url: string, data: any, config = {}) => {
        const result = await axios.post(url, data, config);
        return {
          status: result.status,
          data: result.data,
        };
      },
}
export default service;