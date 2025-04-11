import axios from "axios";

const service = {
    get: async (url: string, config={}) => {
       const result= await axios.get(url,config)
       const data = result.data
       JSON.stringify(data)
       return data
    },
    post: async  (url: string, data: any) => {
        const result= await fetch (url, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return result
       
    }
}
export default service;