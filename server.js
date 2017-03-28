'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

const USERS = {
    '1': {
        name: 'John'
    },
    '2': {
        name: 'Jane'
    }
}

const ARTICLES = {
    '1': {
        title: 'Article A',
        author: {
            id: '1'
        }
    },
    '2': {
        title: 'Article B',
        author: {
            id: '2'
        }
    }
}

app.get('/authors/:id', (req, res) => {
    const {id} = req.params;
    res.status(200).send(USERS[id]);
})

app.get('/articles/:id', (req, res) => {
    const {id} = req.params;
    res.status(200).send(ARTICLES[id]);
})

app.listen(3500, () => {
    console.log('Listening on 4000');
});
