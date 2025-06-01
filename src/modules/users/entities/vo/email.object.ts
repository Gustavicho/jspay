export default class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      throw new Error("email: "+`got '${value}' (invalid email format)`);
    }
    this._value = value.toLowerCase();
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }
}