require('dotenv').config();
const axios = require('axios')
const sendOtp = async (phoneNumber, otp) => {
try{
    const url = "https://api.textlocal.in/send/";
    const params = {
      apikey:process.env.SECRET_KEY,
      numbers: phoneNumber,
      message: `${otp} is the OTP for Login/Register. OTP is valid for 5 Minutes. Do not share this OTP with anyone. Regards, Team Programmics Technology.`,
      sender:process.env.SENDER
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const response = await axios.get(url, { params, headers });
   
}catch (error) {
    console.error("Error in sendOtp function: ", error.message);
  }
};

module.exports = sendOtp;
