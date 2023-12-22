var express = require('express');
var app = express();
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }


app.use(express.static("public"));

app.get('/', function (req, res) {
    res.send("Hello World!")
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`This app is avalible on: http://localhost:${PORT}/`));