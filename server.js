const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/initiateSTKPush', async (req, res) => {
  try {
    
    const userId = Math.floor(Math.random() * 1000000);

    // Get authorization 
    const tokenResponse = await axios.post('https://api-omnichannel-uat.azure-api.net/v2.1/oauth/token', {
      grant_type: 'client_credentials',
      client_id: process.env.ClientId,
      client_secret: process.env.ClientSecret,
    });
    const authToken = tokenResponse.data.access_token;

    // Initiate STK push
    const response = await axios.post('https://api-omnichannel-uat.azure-api.net/v1/stkussdpush/stk/initiate', {
      phoneNumber: req.body.phone_number,
      reference: `REF${userId}`,
      amount: req.body.amount,
      telco: req.body.telco,
      countryCode: req.body.code,
      callBackUrl: 'https://domain.com/callback',
      errorCallBackUrl: 'https://domain.com/callback/error'
        }, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
     );

    res.json({ referenceNumber: `REF${userId}`,
               statusMessage: response.statusmessage);
              
  } catch (error) {
      
    console.error(error);
      
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
