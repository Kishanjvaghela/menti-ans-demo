import { Choice } from "./Choice";
export class Question implements IQuestion {
  type!: string;
  question!: string;
  choices!: Choice[];
}

interface IQuestion {
  type: string;
  question: string;
  choices: Choice[];
}
