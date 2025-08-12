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
        const response = await axios.post('/api/register', {
            userData: userData
        });

        // axios tự động throw lỗi nếu status >= 400
        // nên không cần if (!response.ok) như fetch
        return response.data;

    } catch (error: any) {
        console.error("Error fetching register:", error);

        // Nếu muốn lấy rõ thông tin lỗi từ axios
        if (error.response) {
            // Server trả lỗi (status code ngoài 2xx)
            throw { 
                status: error.response.status, 
                ...error.response.data 
            };
        } else if (error.request) {
            // Request gửi đi nhưng không nhận phản hồi
            throw { message: "No response from server" };
        } else {
            // Lỗi khi set up request
            throw { message: error.message };
        }
    }
}