import fetch from "node-fetch";
import { from } from "rxjs";
import { map, switchMap, mergeMap, toArray, filter } from "rxjs/operators";

import { QueResponse } from "./models/QueResponse";
import { Question } from "./models/Question";
import { ResultResponse } from "./models/ResultResponse";
import { Result } from "./models/Result";
import { Choice } from "./models/Choice";

const getQuestions = (id: string) => {
  if (!id) {
    console.log("Please add proper id");
  }
  console.log("Loading...", id);
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
    mergeMap((question: Question, val: number) => {
      return from(
        fetch(`https://api.mentimeter.com/questions/${question.id}/result`)
      ).pipe(
        switchMap((response) => response.json()),
        map((data: ResultResponse) => {
          question.choices = data.results.questions[question.id].choices;
          return question;
        })
      );
    }),
    toArray()
  );

  observable.subscribe((questions: Question[]) => {
    console.log("Total Questions", questions.length);
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
