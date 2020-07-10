import { Choice } from "./Choice";
export class Question implements IQuestion {
  id!: string;
  type!: string;
  public_key!: string;
  question!: string;
  choices!: Choice[];
  admin_key!: string;
  question_image_url!: string;
}

interface IQuestion {
  id: string;
  type: string;
  question: string;
  choices: Choice[];
  admin_key: string;
}
