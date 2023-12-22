var express = require('express');
var app = express();


app.use(express.static("public"));

app.get('/', function (req, res) {
    res.send("Hello World!")
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`This app is avalible on: http://localhost:${PORT}/`));