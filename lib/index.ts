import fetch from "node-fetch";
import { from } from "rxjs";
import { map, switchMap, mergeMap, toArray, filter } from "rxjs/operators";
import fs from "fs";
import { QueResponse } from "./models/QueResponse";
import { Question } from "./models/Question";
import { ResultResponse } from "./models/ResultResponse";
import { Result } from "./models/Result";
import { Choice } from "./models/Choice";

const resultObservable = (question: Question) => {
  // We can pass question.admin_key instead of question.id
  const resultPromise = fetch(
    `https://api.mentimeter.com/questions/${question.id}/result`
  );
  return from(resultPromise).pipe(
    switchMap((response) => response.json()),
    map((data: ResultResponse) => {
      question.choices = data.results.questions[question.id].choices;
      return question;
    })
  );
};

const questionObservable = (id: string) => {
  // https://www.menti.com/core/vote-keys/800726/series?page=voting_web_first

  const questionPromise = fetch(
    `https://www.menti.com/core/vote-ids/${id}/series`
  );
  const observable = from(questionPromise).pipe(
    switchMap((response) => response.json()),
    map((queResponse) => {
      if(queResponse && queResponse.questions) {
        console.log("Name", queResponse.name);
        console.log("Total Slides", queResponse.questions.length);
      }
      return queResponse;
    }),
    mergeMap((queResponse: QueResponse) => queResponse.questions),
    filter((question: Question) => question.type === "quiz"),
    mergeMap(resultObservable),
    toArray()
  );
  return observable;
};

const getQuestions = (id: string, fileName: string | undefined) => {
  if (!id) {
    console.log("Please add proper id");
  }
  console.log("Loading...", id);
  console.log("==========================");
  const observable = questionObservable(id);

  observable.subscribe((questions: Question[]) => {
    const printLogs: string[] = [];
    printLogs.push(`Total Questions: ${questions.length}`);
    printLogs.push("==========================");
    questions.forEach((que: Question, index: number) => {
      printLogs.push(`\n[${index + 1}] ${que.question}`);
      que.choices.forEach((choice: Choice) => {
        const answer = choice.correct_answer === true ? "*" : " ";
        printLogs.push(`\t(${answer}) ${choice.label}`);
      });
    });
    if (fileName) {
      const stream = fs.createWriteStream(fileName);
      stream.once("open", function (fd: any) {
        printLogs.forEach((log: string) => {
          stream.write(`${log}\n`);
        });
        stream.end();
        console.log(
          `Questions and Answers write completed to file: ${fileName}`
        );
      });
    } else {
      printLogs.forEach((text: string) => {
        console.log(text);
      });
    }
  },
  err => console.log('HTTP Error', err),
  () => console.log('HTTP request completed.'));
};

const getMentiAnswers = async () => {
  const args = process.argv;
  if (args.length >= 3) {
    const token = args[2];
    const fileName = args.length === 4 ? args[3] : undefined;
    await getQuestions(token, fileName);
  } else {
    console.log("Please add proper token");
  }
};

getMentiAnswers();
