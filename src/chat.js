const { default: axios } = require("axios");
require('dotenv').config();
console.log('Environment variables loaded:', {
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN
});
const sendTrialMessage = async () => {
   try{
   const response = await axios.post(`https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,{
        messaging_product: "whatsapp",
        to: 917236005136,
        type: "template",
        template: {
            name: "reminder_message",
            language: {
                code: "en"
            },
            components: [
                {
                    type: "header",
                    parameters: [
                        {
                            type: "text",
                            text: "raj mishra"
                        }
                    ]
                },
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: "5"
                        }
                    ]
                }
            ]

        }
        },{
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
    console.log('Trial message sent successfully:', response.data);
   }
   catch (error) {
    console.error('Error sending trial message:', error);
  }
};

module.exports = {
  sendTrialMessage
};