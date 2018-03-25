let cheegerdb = require('./db.js');
let util = require('util');
let express = require('express');
let bodyParser = require('body-parser');
let port = process.env.PORT || 3000;
let origin = process.env.ORIGIN;

function Server() {
  this.app = express();
  this.app.use(bodyParser.json());

  this.app.get('/ping', (req, res) => res.sendStatus(200));

  this.app.post('/comments', (req, res) => {
    let comment = req.body.comment;
    let url = req.body.url;
    if(!comment || !url){
      res.sendStatus(400);
      return;
    }
    cheegerdb.add(req.body.author || 'visitor', comment, url, () => {
      res.sendStatus(200);
      return;
    });
  });

  this.app.get('/comments', (req, res) => {
    let url = req.query.url;
    if(!url){
      res.sendStatus(400);
      return;
    }
    cheegerdb.getCommentsByUrl(url, (err, rows) => {
      res.json({
        comments: rows
      });
    });

  })
  this.server = this.app.listen(port);
  cheegerdb.setup();
}
module.exports = Server;
