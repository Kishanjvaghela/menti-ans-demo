export class Question implements IQuestion{
    type!: string;
    question!: string;
}

interface IQuestion {
    type: string;
    question: string;
}