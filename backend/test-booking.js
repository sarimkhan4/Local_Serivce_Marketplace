const axios = require('axios');
axios.post('http://localhost:3000/bookings', {
  customerId: 1,
  providerId: 1,
  addressId: 1,
  date: "2026-04-09T04:11:00.000Z",
  totalAmount: 205.20
}).then(res => console.log(res.data)).catch(err => {
  console.log(err.response.data);
  console.log(err.response.data.message);
});
