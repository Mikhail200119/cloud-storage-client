import axios from "axios";

export default axios.create({
    baseURL:"https://localhost:7221"
});

//  headers:{
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
//     }