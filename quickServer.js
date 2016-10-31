
var e = require('express');

var app = e();

app.use(e.static('./www'));

app.listen(3000);