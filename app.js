var express = require('express');
var app = express();

var BodyParser = require('body-parser');
app.use(
    BodyParser.urlencoded({
        extended: true
    })
);

var MethodOverride = require('method-override');
app.use(MethodOverride("_method"));

app.set('view engine', 'ejs');

//==================
//SERVER
//==================

app.listen(3000, function () {
    console.log('BlogPost server has started');
});

//===========================
//DATABASE
//==========================

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BlogPost', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});
var BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});
var Blog = mongoose.model('Campgrounds', BlogSchema);

//=========================
//ROUTES
//=========================

app.get('/', function (req, res) {

    res.redirect('/blogs');
});



app.get('/blogs', function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                blogs: blogs
            });
        }
    });

});

app.get('/blogs/new', function (req, res) {
    res.render('new');
});

app.post('/blogs', function (req, res) {


    Blog.create(req.body.blog, function (err, neww) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/blogs');
        }
    });

});

app.get('/blogs/:id', function (req, res) {

    Blog.findById(req.params.id, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            res.render('moreinfo', {
                blogs: found
            })
        }
    });
});

app.get('/blogs/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, edited) {

        if (err) {
            console.log(err)
        } else {
            res.render('edit', {
                blogs: edited
            })

        }
    });
});
app.delete('/blogs/:id', function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs')
        }
    });
});
app.put('/blogs/:id', function (req, res) {


    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});