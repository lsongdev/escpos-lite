const EventEmitter = require('events');

class Escpos extends EventEmitter {
  constructor(connector){
    super();
    this.connector = connector;
    return this;
  }
  text(content){
    return this.write(content);
  }
  cut(mode = Escpos.CUT_FULL, lines = 3){
    return this.write(Escpos.GS + 'V' + mode + lines);
  }
  barcode(){
    return this.write(Escpos.GS + 'k');
  }
  feed(lines = 1){
    if(line <= 1) return this.write(Escpos.LF);
    return this.write(Escpos.ESC + 'd' + lines);
  }
  write(data){
    return new Promise((resolve, reject) => {
      this.connector.write(data, err => {
        if(err) return reject(err);
        resolve(this);
      });
    });
  }
}

Escpos.ESC      = '\x1b';
Escpos.LF       = '\x0a';
Escpos.CUT_FULL = '\x0a';

module.exports = Escpos;