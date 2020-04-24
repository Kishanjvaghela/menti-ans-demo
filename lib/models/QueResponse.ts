import { Questions } from "./Questions";
export class QueResponse implements IQueResponse {
  name!: string;
  questions!: Questions[];
}

interface IQueResponse {
  name: string;
  questions: Questions[];
}
