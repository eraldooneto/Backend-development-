// Importing Express
const express = require('express');
const app = express();
const connection = require('./database/database');
const asks = require('./database/Ask');
const Answer = require('./database/Answer');

// Translate data received from HTML forms to a formate that Node.JS can understand
const bodyParser = require('body-parser');
const port = 8080;

// Database connection
connection
    .authenticate()
    .then(() => {
        console.log("The database connection was successfully established.");
    })
    .catch((errorMessage) => {
        console.log(errorMessage);
    })

// Body parser configure
app.use(bodyParser.urlencoded({extendend: false}));
app.use(bodyParser.json());

// Render HTML on my NodeJS, with EJS
app.set('view engine', 'ejs');

// Using static files as CSS
app.use(express.static('public'));

app.get('/', (req, res) => {
    asks.findAll({raw: true, order:[['id', 'DESC']]}).then((asks) => {
        res.render('index', {asks: asks});

    });
});

app.get("/ask", (req, res) => {
    res.render('ask');
});

// Recieve data from forms
app.post("/saveQuestions", (req, res) => {
    // Catching 
    var title = req.body.title;
    var description = req.body.description;

    asks.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect('/');
    });
});

app.get("/ask/:id", (req, res) => {
    var id = req.params.id;
    asks.findOne({
        where: {id: id}
    }).then(ask => {
        if(ask != undefined){

            Answer.findAll({
                where: {askId: ask.id},
                order:[['id', 'DESC']]
            }).then(answers => {
                res.render("-ask", {
                    ask: ask,
                    answers: answers
            });
        });
        } else{
            res.redirect("/");
        } 
    })
});

app.post("/answer", (req,res) => {
    var body = req.body.body;
    var askId = req.body.ask;
    Answer.create({
        body: body,
        askId: askId
    }).then(() => {
        res.redirect("/ask/" + askId);
    });
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}.`);
});