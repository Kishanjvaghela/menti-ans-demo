import { Question } from "./Question";
export class Result implements IResult {
  questions!: {
    [key: string]: Question;
  };
}

interface IResult {
  questions: { [key: string]: Question };
}
