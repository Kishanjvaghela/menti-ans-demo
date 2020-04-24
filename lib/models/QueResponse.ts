import { Question } from "./Question";
export class QueResponse implements IQueResponse {
  name!: string;
  questions!: Question[];
}

interface IQueResponse {
  name: string;
  questions: Question[];
}
