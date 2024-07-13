const express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    sanitizer = require('sanitizer'),
    app = express(),
    port = process.env.PORT || 8000;

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

let todolist = [];

// Routes
app.get('/todo', (req, res) => {
    res.render('todo.ejs', {
        todolist,
        clickHandler: "func1();"
    });
});

app.post('/todo/add/', (req, res) => {
    let newTodo = sanitizer.escape(req.body.newtodo);
    if (req.body.newtodo != '') {
        todolist.push(newTodo);
    }
    res.redirect('/todo');
});

app.get('/todo/delete/:id', (req, res) => {
    if (req.params.id != '') {
        todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
});

app.get('/todo/:id', (req, res) => {
    let todoIdx = req.params.id;
    let todo = todolist[todoIdx];
    if (todo) {
        res.render('edititem.ejs', {
            todoIdx,
            todo,
            clickHandler: "func1();"
        });
    } else {
        res.redirect('/todo');
    }
});

app.put('/todo/edit/:id', (req, res) => {
    let todoIdx = req.params.id;
    let editTodo = sanitizer.escape(req.body.editTodo);
    if (todoIdx != '' && editTodo != '') {
        todolist[todoIdx] = editTodo;
    }
    res.redirect('/todo');
});

app.use((req, res, next) => {
    res.redirect('/todo');
});

// Start server
app.listen(port, 'localhost', () => {
    console.log(`Todolist running on http://localhost:${port}`);
});

module.exports = app;
