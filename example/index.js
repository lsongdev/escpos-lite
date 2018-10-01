const fs = require('fs');
const ESCPOS = require('..');


const device = fs.createWriteStream('/dev/cu.usbserial');

const printer = new ESCPOS(device);

(async () => {

  printer.align('center');
  printer.underline(1);
  printer.text('Hello');
  printer.feed(3);
  // printer.cut(1);

})();