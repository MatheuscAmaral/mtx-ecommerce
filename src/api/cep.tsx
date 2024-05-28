import axios from "axios";

const cepApi = axios.create({
    baseURL: "https://opencep.com/v1/"
})

export default cepApi;