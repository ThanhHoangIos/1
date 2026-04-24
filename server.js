const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_URL = "http://160.250.247.143:3001/api/ditmemaysun";

let cache = [];

// lấy dữ liệu liên tục
async function fetchData(){
  try{
    const res = await axios.get(API_URL);
    const data = res.data;

    // 1 phiên
    if(data && data.tong !== undefined){
      cache.push(data);
    }

    // list
    if(Array.isArray(data)){
      cache.push(...data);
    }

    // data.data
    if(data && data.data && Array.isArray(data.data)){
      cache.push(...data.data);
    }

    // giới hạn 1000
    if(cache.length > 1000){
      cache = cache.slice(-1000);
    }

  }catch(e){
    console.log("API error:", e.message);
  }
}

// chạy 24/7
setInterval(fetchData, 2000);
fetchData();

// API cho web
app.get("/data", (req,res)=>{
  res.json(cache);
});

app.get("/", (req,res)=>{
  res.send("Casino server running 24/7");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log("Server running on port", PORT);
});
