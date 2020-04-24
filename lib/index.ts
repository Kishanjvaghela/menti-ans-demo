import fetch from "node-fetch";
import { QueResponse } from "./models/QueResponse";

const getQuestions = async (id: string) => {
  if (!id) {
    console.log("Please add proper id");
  }
  console.log("Loading...", id);
  // https://www.menti.com/core/vote-keys/83c3zmzy28/series
  //   fetch("https://www.menti.com/core/vote-keys/83c3zmzy28/series")
  //     .then((res: any) => res.text())
  //     .then((body: any) => console.log(body));
  try {
    const response = await fetch(
      `https://www.menti.com/core/vote-keys/${id}/series`
    ).then((res: any) => res.text());
    if (response) {
    console.log(response);
    
      const queResponse: QueResponse = JSON.parse(response);
      console.log("Name", queResponse.name);
      console.log("Total Questions", queResponse.questions.length);
    } else {
      console.log("Response not found", response);
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
