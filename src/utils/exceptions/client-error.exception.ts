export class ClientError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "Client Error";
    this.statusCode = statusCode;

    if (this.constructor.name === "Client Error") {
      throw new Error("cannot instantiate abstract class");
    }
  }
}
