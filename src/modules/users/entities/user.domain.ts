import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import Email from "./vo/email.object";
import UserError from "./user.error";

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  password: string;
  createdAt: Date;
  removed: boolean;
}

export interface CreateUserProps {
  name: string;
  email: Email;
  password: string;
}

export default class User {
  public readonly id: string;
  private _name: string;
  private _email: Email;
  private _passwordHash: string;
  public readonly createdAt: Date;
  private _updatedAt: Date;
  private _isActive: boolean;

constructor(props: UserProps) {
    if (!props.id || props.id.trim().length === 0) throw UserError.invalidId(props.id);
    this.id = props.id.trim();

    if (!props.name || props.name.trim().length < 3) {
      throw UserError.invalidName(props.name);
    }
    this._name = props.name.trim();

    this._email = props.email;

    if (!props.password || props.password.length === 0) {
      throw UserError.passwordTooShort();
    }
    this._passwordHash = props.password;

    this.createdAt = props.createdAt;
    this._updatedAt = new Date(this.createdAt);
    this._isActive = !props.removed;
  }

  public static async create(params: CreateUserProps): Promise<User> {
    if (!params.password || params.password.length < 8) {
      throw UserError.passwordTooShort();
    }

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(params.password, salt);

    return new User({
      id: randomUUID(),
      name: params.name,
      email: params.email,
      password: hash,
      createdAt: new Date(),
      removed: false,
    });
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  password(masked: boolean = true): string {
    return masked
        ? "***"
        : this._passwordHash;
  }

  public isActive(): boolean {
    return this._isActive;
  }

  public updateName(newName: string): this {
    if (!newName || newName.trim().length < 3) throw UserError.invalidName(newName);

    this._name = newName.trim();
    this._touch();
    return this;
  }

  public updateEmail(newEmail: Email): this {
    if (newEmail.equals(this._email)) {
      return this;
    }
    this._email = newEmail;
    this._touch();
    return this;
  }

  public async updatePassword(oldPassword: string, newPassword: string): Promise<this> {
    const isMatch = await bcrypt.compare(oldPassword, this._passwordHash);
    if (!isMatch) throw UserError.passwordMismatch();

    if (!newPassword || newPassword.length < 8) {
      throw UserError.passwordTooShort();
    }

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    this._passwordHash = await bcrypt.hash(newPassword, salt);

    this._touch();
    return this;
  }

  public async comparePassword(candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this._passwordHash);
  }

  public remove(): this {
    if (!this._isActive) {
      return this;
    }
    this._isActive = false;
    this._touch();
    return this;
  }

  public restore(): this {
    if (this._isActive) {
      return this;
    }
    this._isActive = true;
    this._touch();
    return this;
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
