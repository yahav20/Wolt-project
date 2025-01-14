const express = require('express');
const app = express();
const PORT = 4000;
const apiRoutes = require('./routes/api');
const dashboardRoute = require('./routes/dashboard')

app.use('/api', apiRoutes);
app.use('/', dashboardRoute);

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});