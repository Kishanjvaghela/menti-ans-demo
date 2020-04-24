export class Response implements IResponse{
    message!: string;
}

interface IResponse {
    message: string;
}