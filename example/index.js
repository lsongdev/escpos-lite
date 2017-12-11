const Escpos = require('..');

const printer = new Escpos();

printer
.text('hello')
.cut();