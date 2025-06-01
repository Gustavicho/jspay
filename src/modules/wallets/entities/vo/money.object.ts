import {
  CurrencyMismatchError,
  DivisionByZeroError,
  InvalidArgumentError,
} from "./money.error";

export enum MoneyCurrency {
  BRL = "BRL",
  USD = "USD",
}

export interface MoneyProps {
  amountInCents: number;
  currency: MoneyCurrency;
}

export default class Money {
  private readonly _cents: number;
  public readonly currency: MoneyCurrency;
  public readonly decimalPlaces: number = 2;

  constructor(props: MoneyProps) {
    if (Number.isNaN(props.amountInCents) || !Number.isFinite(props.amountInCents)) {
      throw new InvalidArgumentError("value", "must be a finite number");
    }
    if (!Object.values(MoneyCurrency).includes(props.currency)) {
      throw new InvalidArgumentError("currency", `"${props.currency}" is not a supported currency`);
    }

    this.currency = props.currency;
    this._cents = Math.round(props.amountInCents * Math.pow(10, this.decimalPlaces));
  }

  public static zero(currency: MoneyCurrency): Money {
    return new Money({ amountInCents: 0, currency: currency });
  }

  public get amount(): number {
    return this._cents / Math.pow(10, this.decimalPlaces);
  }

  public get amountInCents(): number {
    return this._cents;
  }

  public add(other: Money): Money {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
    return new Money({
      amountInCents: (this._cents + other._cents) / Math.pow(10, this.decimalPlaces),
      currency: this.currency
    });
  }

  public subtract(other: Money): Money {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
    return new Money({
      amountInCents: (this._cents - other._cents) / Math.pow(10, this.decimalPlaces),
      currency: this.currency
    });
  }

  public multiply(factor: number): Money {
    if (Number.isNaN(factor) || !Number.isFinite(factor)) {
      throw new InvalidArgumentError("factor", "must be a finite number");
    }
    const resultCents = Math.round(this._cents * factor);
    return new Money({
      amountInCents: resultCents / Math.pow(10, this.decimalPlaces),
      currency: this.currency
    });
  }

  public divide(divisor: number): Money {
    if (Number.isNaN(divisor) || !Number.isFinite(divisor)) {
      throw new InvalidArgumentError("divisor", "must be a finite number");
    }
    if (divisor === 0) {
      throw new DivisionByZeroError();
    }
    const resultCents = Math.round(this._cents / divisor);
    return new Money({
      amountInCents: resultCents / Math.pow(10, this.decimalPlaces),
      currency: this.currency
    });
  }

  public equals(other: Money): boolean {
    return (
      this.currency === other.currency &&
      this._cents === other._cents
    );
  }

  public greaterThan(other: Money): boolean {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
    return this._cents > other._cents;
  }

  public lessThan(other: Money): boolean {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
    return this._cents < other._cents;
  }

  public format(locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this.currency,
      minimumFractionDigits: this.decimalPlaces,
      maximumFractionDigits: this.decimalPlaces,
    }).format(this.amount);
  }

  public convertTo(targetCurrency: MoneyCurrency, rate: number): Money {
    if (Number.isNaN(rate) || !Number.isFinite(rate) || rate <= 0) {
      throw new InvalidArgumentError("rate", "must be a positive, finite number");
    }
    const convertedCents = Math.round(
      this.amount * rate * Math.pow(10, this.decimalPlaces)
    );
    return new Money({
      amountInCents: convertedCents / Math.pow(10, this.decimalPlaces),
      currency: targetCurrency
    });
  }
}
