import dotenv from "dotenv";

dotenv.config();

config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: "gryffindor-rc.appspot.com",
  messagingSenderId: process.env.MESSAGINGSENDERID
};

export default config;
