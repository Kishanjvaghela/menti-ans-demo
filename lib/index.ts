import fetch from "node-fetch";
import { QueResponse } from "./models/QueResponse";
import { Question } from './models/Question';

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
      if(queResponse.questions.length > 0) {
        const questions = queResponse.questions.filter((question: Question) => question.type === 'quiz');
        console.log("Total Questions", questions.length);
        questions.forEach((question: Question) => {
          console.log(question.question);
        })
      }
    } else {
      console.log("Error", response.status);
    }
  } catch (error) {
    console.log("Error", error);
  }
};

process.argv.forEach(async (val: string, index: number) => {
  if (index === 2 && val) {
    await getQuestions(val);
  } else {
    console.log(index + ": " + val);
  }
});
