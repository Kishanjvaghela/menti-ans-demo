import fetch from "node-fetch";
import { from } from "rxjs";
import { map, switchMap, mergeMap, toArray, filter } from "rxjs/operators";

import { QueResponse } from "./models/QueResponse";
import { Question } from "./models/Question";
import { ResultResponse } from "./models/ResultResponse";
import { Result } from "./models/Result";
import { Choice } from "./models/Choice";

const resultObservable = (question: Question) => {
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
  const questionPromise = fetch(
    `https://www.menti.com/core/vote-keys/${id}/series`
  );
  const observable = from(questionPromise).pipe(
    switchMap((response) => response.json()),
    map((queResponse) => {
      console.log("Name", queResponse.name);
      console.log("Total Slides", queResponse.questions.length);
      return queResponse;
    }),
    mergeMap((queResponse: QueResponse) => queResponse.questions),
    filter((question: Question) => question.type === "quiz"),
    mergeMap(resultObservable),
    toArray()
  );
  return observable;
};

const getQuestions = (id: string) => {
  if (!id) {
    console.log("Please add proper id");
  }
  console.log("Loading...", id);
  console.log('==========================');
  const observable = questionObservable(id);

  observable.subscribe((questions: Question[]) => {
    console.log("Total Questions", questions.length);
    console.log('==========================');
    questions.forEach((que: Question, index: number) => {
      console.log(`\n[${index + 1}] ${que.question}`);
      que.choices.forEach((choice: Choice) => {
        const answer = choice.correct_answer === true ? '*' : ' ';
        console.log(`\t(${answer}) ${choice.label}`);
      })
    });
  });
};

// npm run menti 83c3zmzy28
process.argv.forEach(async (val: string, index: number) => {
  if (index === 2 && val) {
    await getQuestions(val);
  } else {
    console.log(index + ": " + val);
  }
});
