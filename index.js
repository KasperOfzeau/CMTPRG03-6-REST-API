console.log("Hello World!")

const { response } = require("express");
let express = require("express");

let app = express();

app.get("/", (request, response) => {
    response.send('<h1>Hello World!</h1><form action="/" method="post"><input type="text"><input type="submit" value="submit"></form>');
})

app.post("/", (request, response) => {
    response.send('<h1>Hello World!</h1><form action="/" method="post"><input type="text"><input type="submit" value="submit"></form><p>Formuleer verzonden</p>');
})

app.listen(8080);