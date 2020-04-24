export class Choice implements IChoice{
    label!: string;
    id!: number;
    position!: number;
}

interface IChoice {
    label: string;
    id: number;
    position: number;
}