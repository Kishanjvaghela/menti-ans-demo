import { getQuestions } from './service';
const { program } = require('commander');

program
  .option('-d, --debug', 'output extra debugging')
  .option('-i, --id <type>', 'Menti Id without space')
  .option('-k, --key <type>', 'Menti key ')
  .option('-f, --file <type>', 'Save result as a file');
 
program.parse(process.argv);
 
if (program.debug) console.log(program.opts());

getQuestions(program.id, program.key, program.file);
