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
  // console.log('resultObservable');
  // https://api.mentimeter.com/questions/6482ebc26047/result
  // https://api.mentimeter.com/series/fcdd1f464a548e6536bea477460456fc
  const resultPromise = fetch(
    `https://api.mentimeter.com/questions/${question.public_key}/result`
  );
  return from(resultPromise).pipe(
    switchMap((response) => response.json()),
    map((data: ResultResponse) => {
      console.log("data", data);
      question.choices = data.results
        ? data.results.questions[question.id].choices
        : question.choices;
      return question;
    })
  );
};

const questionObservable = (url: string) => {
  // https://www.menti.com/core/vote-keys/800726/series?page=voting_web_first
  const questionPromise = fetch(url);
  const observable = from(questionPromise).pipe(
    switchMap(async (response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        const errorJSON = await response.json();
        throw errorJSON && errorJSON.message
          ? errorJSON.message
          : response.statusText;
      }
    }),
    map((queResponse: QueResponse) => {
      if (queResponse && queResponse.questions) {
        console.log("Name", queResponse.name);
        console.log("Total Slides", queResponse.questions.length);
      } else {
        throw "No Questions available";
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

export const getQuestions = (
  id: string,
  key: string,
  fileName: string | undefined,
  htmlFileName: string | undefined
) => {
  console.log("==========================");
  let url = "";
  if (id) {
    url = `https://www.menti.com/core/vote-ids/${id}/series`;
    console.log("Loading with id...", id);
  } else if (key) {
    url = `https://www.menti.com/core/vote-keys/${key}/series`;
    console.log("Loading with key...", key);
  } else {
    console.error("Id or Key is required");
    return;
  }
  // url = 'https://api.mentimeter.com/series/1365dc16bee810f0346d1fd9251a5cd6';

  console.log("==========================");
  const observable = questionObservable(url);
  observable.subscribe(
    (questions: Question[]) => {
      // questions.sort((a: Question, b: Question) => a.question)
      const printLogs: string[] = [];
      if (htmlFileName) {
        printLogs.push("<!DOCTYPE html>");
        printLogs.push("<html>");
        printLogs.push(`<head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
            img {
              max-width: 400px;
              height: auto;
            }
            </style>
            </head>`);
        printLogs.push("<body>");
        printLogs.push(`<h1>Total Questions: ${questions.length}</h1>`);
        printLogs.push("<br />");
        printLogs.push("<ul>");
        questions.forEach((que: Question, index: number) => {
          printLogs.push(`<li>[${index + 1}] ${que.question}</li>`);

          let queries = que.question.trim().replace(" ", "+");
          const indexForDot = queries.indexOf('.');
          if(indexForDot >= 0) {
            queries = queries.substr(indexForDot + 1);
          }
          queries = queries.trim();
          const googleUrl = `https://www.google.com/search?q=${queries}&oq=${queries}`;
          printLogs.push(`<a target="_blank" href="${googleUrl}">Google It</a><br>`);
          const bingUrl = `https://www.bing.com/search?q=${queries}`;
          printLogs.push(`<a target="_blank" href="${bingUrl}">Bing It</a><br>`);
          if (que.question_image_url) {
            printLogs.push(
              `<img src="${que.question_image_url}" alt="${que.question}"><br>`
            );
          }
          que.choices.forEach((choice: Choice) => {
            const answer = choice.correct_answer === true ? "*" : " ";
            printLogs.push(
              `<input type="radio" id="${choice.id}" name="${que.id}" value="${choice.label}">`
            );
            printLogs.push(
              `<label for="${choice.label}">${choice.label}</label><br>`
            );
          });
          printLogs.push("<br>");
        });
        printLogs.push("<ul>");
        printLogs.push("</html>");
        printLogs.push("</body>");
        if (htmlFileName) {
          const stream = fs.createWriteStream(htmlFileName);
          stream.once("open", function (fd: any) {
            printLogs.forEach((log: string) => {
              stream.write(`${log}\n`);
            });
            stream.end();
            console.log(
              `Questions and Answers write completed to file: ${htmlFileName}`
            );
          });
        } else {
          printLogs.forEach((text: string) => {
            console.log(text);
          });
        }
      } else {
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
      }
    },
    (err) => console.error("HTTP Error ", err),
    () => console.log("HTTP request completed.")
  );
};
