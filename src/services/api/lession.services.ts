import axios from "../../config/axiosconfig";

export const getLession = async (): Promise<any> => {
    try {
        const response = await axios.get('/api/lessions');

        // console.log(response.data);

        if(response){
            return response.data;
        }

    } catch (error: any) {
        throw Error (error.message);
    }
}

