import axios from "axios";

const service = {
    get: async (url: string) => {
       const result= await axios.get(url)
         return result.data
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