import axios from "axios";
export const callApi = (getOptions) => {
    try {
        return axios(getOptions);
    } catch (e) {
        return e.response;
    }
};