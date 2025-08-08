import axios from "../../config/axiosconfig";

export const fetchLogin = async (data: any): Promise<any> => {
    try {
        // console.log("Fetching login with data:", data);

        const response = await axios.post('/api/login',
        {
            email: data.email,
            password: data.password
        });      

        return response.data;  
    } catch (error) {
        console.error("Error fetching login:", error);
        throw error; // Re-throw the error for further handling
    }
}

export const fetchLoginWithPhone = async (data: any): Promise<any> => {
    try {
        // console.log("Fetching login with data:", data);

        const response = await axios.post('/api/loginwithphone',
        {
            phone: data.phoneNumber
        });      

        return response.data;  
    } catch (error) {
        console.error("Error fetching login:", error);
        throw error; // Re-throw the error for further handling
    }
}

export const fetchRegister = async (userData: any): Promise<any> => {
    try {
        // console.log("Fetching login with data:", data);

        const response = await axios.post('/api/register',
        {
            userData: userData
        });      

        return response.data;  
    } catch (error) {
        console.error("Error fetching login:", error);
        throw error; // Re-throw the error for further handling
    }
}