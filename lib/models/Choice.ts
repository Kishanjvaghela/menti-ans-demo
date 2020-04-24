export class Choice implements IChoice{
    label!: string;
    id!: number;
    position!: number;
    correct_answer!: boolean;
    marked_correct!: boolean;
}

interface IChoice {
    label: string;
    id: number;
    correct_answer: boolean;
    marked_correct: boolean;
}