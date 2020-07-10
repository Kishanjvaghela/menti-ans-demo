import { getQuestions } from './service';
const { program } = require('commander');

program
  .option('-m, --menti', 'for menti')
  .option('-p, --playstore', 'for playstore')
  .option('-l, --link <type>', 'playstore link')
  .option('-d, --debug', 'output extra debugging')
  .option('-i, --id <type>', 'Menti Id without space')
  .option('-k, --key <type>', 'Menti key ')
  .option('-h, --html <type>', 'Save result as a html')
  .option('-f, --file <type>', 'Save result as a file');
 
program.parse(process.argv);
 
if (program.debug) console.log(program.opts());
// node dist/index.js -d -k b6h2dsfqgk -f result.txt
// if(program.menti) {
//   getQuestions(program.id, program.key, program.file);
// } else {
//   console.log('GETTING for playstore');
  
// }

getQuestions(program.id, program.key, program.file, program.html);

