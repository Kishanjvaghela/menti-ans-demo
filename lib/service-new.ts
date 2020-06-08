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
            question.choices = data.results ? data.results.questions[question.id].choices : question.choices;
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
                throw errorJSON && errorJSON.message ? errorJSON.message : response.statusText;
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

export const getQuestions = (id: string, key: string, fileName: string | undefined) => {
    console.log("==========================");
    let url = '';
    if (id) {
        url = `https://www.menti.com/core/vote-ids/${id}/series`;
        console.log("Loading with id...", id);
    } else if (key) {
        url = `https://www.menti.com/core/vote-keys/${key}/series`;
        console.log("Loading with key...", key);
    } else {
        console.error('Id or Key is required');
        return;
    }
//https://www.menti.com/core/vote-keys/800726/series
    console.log("==========================");
    const observable = questionObservable(url);
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
        err => console.error('HTTP Error ', err),
        () => console.log('HTTP request completed.'));
};