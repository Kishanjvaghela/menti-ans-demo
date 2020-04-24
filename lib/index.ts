import fetch from "node-fetch";
import { QueResponse } from "./models/QueResponse";
import { Question } from "./models/Question";
import { ResultResponse } from "./models/ResultResponse";
import { Result } from "./models/Result";

const getQuestions = async (id: string) => {
  if (!id) {
    console.log("Please add proper id");
  }
  console.log("Loading...", id);
  try {
    const response = await fetch(
      `https://www.menti.com/core/vote-keys/${id}/series`
    );
    if (response.status === 200) {
      const responseText = await response.text();
      const queResponse: QueResponse = JSON.parse(responseText);
      console.log("Name", queResponse.name);
      console.log("Total Slides", queResponse.questions.length);
      if (queResponse.questions.length > 0) {
        const questions = queResponse.questions.filter(
          (question: Question) => question.type === "quiz"
        );
        console.log("Total Questions", questions.length);
        const updatedQuestions: Question[] = [];
        await questions.forEach(
          async (question: Question) => {
            const resultResponse = await fetch(
              `https://api.mentimeter.com/questions/${question.admin_key}/result`
            );
            if (resultResponse.status === 200) {
              const resultResponseText = await resultResponse.text();
              const result: ResultResponse = JSON.parse(resultResponseText);
              question.choices = result.results.questions[question.id].choices;
              console.log(result.results.questions[question.id].choices);
            } else {
              console.log("Error while getting result", resultResponse.status);
            }
            updatedQuestions.push(question);
          }
        );
        updatedQuestions.forEach((question: Question) => {
          console.log(question.question);
          console.log(question.choices);
        });
      }
    } else {
      console.log("Error", response.status);
    }
  } catch (error) {
    console.log("Error", error);
  }
};

// npm run menti 83c3zmzy28
process.argv.forEach(async (val: string, index: number) => {
  if (index === 2 && val) {
    await getQuestions(val);
  } else {
    console.log(index + ": " + val);
  }
});
