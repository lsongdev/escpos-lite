const EventEmitter = require('events');
/**
 * ESCPOS
 * @docs https://reference.epson-biz.com/modules/ref_escpos
 * @docs http://content.epson.de/fileadmin/content/files/RSD/downloads/escpos.pdf
 */
class ESCPOS extends EventEmitter {
  constructor(device){
    super();
    this.device = device;
    return this;
  }
  write(buf){
    this.device.write(buf);
    return this;
  }
  exec(lead, cmd, args){
    args = [].slice.call(arguments, 2);
    const buf = Buffer.from([
      lead, cmd
    ].concat(args)
    .map(x => typeof x === 'string' ? x.charCodeAt(0) : x));
    console.log(buf);
    return this.write(buf);
  }
  feed(n){
    if(n) return this.exec(ESCPOS.ESC, 'd', n);
    return this.write(ESCPOS.LF);
  }
  /**
   * Select print mode (s)
   * @param {*} n 
   */
  mode(n){
    return this.exec(ESCPOS.ESC, '!', n);
  }
  reset(){
    return this.exec(ESCPOS.ESC, '@');
  }
  /**
   * Select an international character set
   * @docs https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=29
   * @param {*} n 
   */
  language(n){
    return this.exec(ESCPOS.ESC, 'R', n);
  }
  /**
   * Selects the character font and styles (emphasize, 
   * double-height, double-width, and underline) together.
   */
  style(style){
    return this.mode(style);
  }
  /**
   * Turn emphasized mode on/off
   */
  blod(n){
    return this.exec(ESCPOS.ESC, 'E', n);
  }
  /**
   * Turn underline mode on/off
   * @param {*} n 
   */
  underline(n){
    return this.exec(ESCPOS.ESC, '-', n);
  }
  /**
   * Turn double-strike mode on/off 
   */
  doubleStrike(){
    return this.exec(ESCPOS.ESC, 'G', n);
  }
  /**
   * Select line spacing
   * @docs https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=19
   * @param {*} n 
   */
  lineSpace(n){
    if(n) return this.exec(ESCPOS.ESC, '3', n);
    return this.exec(ESCPOS.ESC, '2');
  }
  /**
   * Select character font
   */
  font(n){
    return this.exec(ESCPOS.ESC, 'M', n);
  }
  size(n){
    return this.exec(ESCPOS.ESC, '', n);
  }
  /**
   * Select justification
   */
  align(n){
    return this.exec(ESCPOS.ESC, 'a', n);
  }
  /**
   * Select printing color
   */
  color(n){
    return this.exec(ESCPOS.ESC, 'r', n);
  }
  /**
   * Select character code table
   */
  codeTable(page){
    return this.exec(ESCPOS.ESC, 't', page);
  }
  /**
   * Select cut mode and cut paper
   */
  cut(m, n){
    return this.exec(ESCPOS.GS, 'V', m, n);
  }
  print(content){
    return this.write(content);
  }
  println(content){
    return this.print(content + '\r\n');
  }
  text(content, encoding){
    if(typeof content !== 'string')
      content = content.toString(encoding)
    return this.println(content);
  }
  barcode(){
    return this.exec(ESCPOS.GS, 'k');
  }
}

ESCPOS.ESC = '\x1b';
ESCPOS.FS  = '\x1c';
ESCPOS.GS  = '\x1d';
ESCPOS.LF  = '\x0a';

module.exports = ESCPOS;