require('dotenv').config()
//数据库接口库
var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(process.env.DB_NAME || 'cheeger.sqlite3');
var db = null;


function createTables() {
  console.log("createTable comments");
  db.run("CREATE TABLE IF NOT EXISTS comments " +
    "(ts DATETIME, author VARCHAR(255), url VARCHAR(255),  comment TEXT)")
}

exports.dropComments = function() {
  db.run("DROP TABLE IF EXISTS comments",
    function(err){
      if (err){
        util.log('[setup] FAIL on dropping table ' + err);
      } else {
        util.log('[setup] Dropped || Not exists');
      }
    });
}

exports.setup = function() {
  console.log("createDb cheeger");
  db = new sqlite3.Database(process.env.DB_NAME || 'cheeger.sqlite3', createTables);
}

//此处的disconnect函数是空的
exports.disconnect = function(){
  db.close();
}

exports.emptyComment = {"ts": "", author: "", url: "", comment: ""};
exports.add = function(author, comment, url, callback){
  db.run("INSERT INTO comments (ts, author, url, comment) " +
    "VALUES (?, ?, ?, ?);",
    [new Date(), author, url, comment],
    function(error){
      if (error){
        util.log('FAIL on add ' + error);
        callback(error);
      } else {
        callback(null);
      }
    });
}
/*
run函数接受一个字符串参数，其中?表示占位符，占位符的值必须通过一个数组传递进来
调用者提供了一个回调函数，然后通过这个回调函数来声明错误
 */

exports.getCommentsByUrl = function(url, callback){
  util.log('get all comments of url');
  db.all("SELECT * FROM comments where url = ?", url, callback);
}
