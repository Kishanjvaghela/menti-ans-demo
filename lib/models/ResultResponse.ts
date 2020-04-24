import { Result } from "./Result";
export class ResultResponse implements IResultResponse {
  type!: string;
  results!: Result;
}

interface IResultResponse {
  type: string;
  results: Result;
}
