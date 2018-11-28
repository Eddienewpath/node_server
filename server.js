//'views' is default director that express uses for templates

const express = require('express');
const hbs = require('hbs'); //handlebar
const fs = require('fs');
const port = process.env.PORT || 3000;// choose the deploy enviroment port number.
/**************************************/
let app = express();  
hbs.registerPartials(__dirname +'/views/partials')
app.set('view engine', 'hbs');
// __dirname stores this project path
// this will serve the static pages inside the public directory
//app.use is how to use middleware . 
/**************************************/
/* 
Middleware just sits between a request and the router handler. So a normal request without middleware would go:
request --> router handler
With middleware it goes:
request --> middleware1 --> middleware2 --> etc... --> router handler
Middleware typically modifies some part of the request and passes it on to the next middleware. The last middleware in the chain passes it to the router handler. 
 */
// this middleware shows how server is working.
app.use((req, res, next) => {
    // console.log(res);
    let now = new Date().toString(); // return a human readable time stamp
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    // must included a callback err handling function. 
    fs.appendFile('server.log', log+'\n', (err) => {
        if(err){
            console.log('unable to append to server.log');
        }
    });
    next(); // this has to be called for latter handler to handle request. 
});

// operation will stop at this middleware. 
// uncomment this middleware if website maitainance is needed 
// app.use((req, res, next) => {
//     res.render('maintainance.hbs'); // 
// });

app.use(express.static(__dirname + '/public'));  // express middleware
/**************************************/
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
    // return 'test';
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});
/*****************************************/
// set up route
// function argument is a request handler
app.get('/', (req, res) => {
    // res.send('<h1>hello express</h1>');
    // res.send({
    //     name: 'eddie',
    //     likes: [
    //         'biking',
    //         'cities'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMessage: 'welcome to home'
    });

});

app.get('/about', (req, res) =>{
    // res.send('about page');
    res.render('about.hbs', {
        pageTitle: 'About Page'
    }); // render views directory static pages. 
});

app.get('/bad', (req, res) => {
    res.send({
       errorMessage: 'unable to handle request' 
    });
});
/**************************************/
// second argument function is optional. 
app.listen(port, () => {
    console.log('server is up on port' + port);
});