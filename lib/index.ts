import { getQuestions } from './service';
const { program } = require('commander');

// const getMentiAnswers = async () => {
//   const args = process.argv;
//   if (args.length >= 3) {
//     const token = args[2];
//     const fileName = args.length === 4 ? args[3] : undefined;
//     await getQuestions(token, fileName);
//   } else {
//     console.log("Please add proper token");
//   }
// };

// getMentiAnswers();

program
  .option('-d, --debug', 'output extra debugging')
  .option('-i, --id <type>', 'Menti Id without space')
  .option('-k, --key <type>', 'Menti key ')
  .option('-f, --file <type>', 'Save result as a file');
 
program.parse(process.argv);
 
if (program.debug) console.log(program.opts());

getQuestions(program.id, program.key, program.file);
