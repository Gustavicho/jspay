import {
  CurrencyMismatchError,
  DivisionByZeroError,
  InvalidArgumentError,
} from './money.error';
import Money, { MoneyCurrency } from './money.object';

describe('Money: ValueObject', () => {
  describe('constructor', () => {
    test('constructor throws InvalidArgumentError for NaN value', () => {
      expect(() => new Money(NaN, MoneyCurrency.USD)).toThrow(
        InvalidArgumentError,
      );
    });

    test('constructor throws InvalidArgumentError for non-finite value', () => {
      expect(() => new Money(Infinity, MoneyCurrency.USD)).toThrow(
        InvalidArgumentError,
      );
      expect(() => new Money(-Infinity, MoneyCurrency.BRL)).toThrow(
        InvalidArgumentError,
      );
    });

    test('constructor creates correct internal cents for valid input', () => {
      const m = new Money(12.34, MoneyCurrency.BRL);

      expect(m.amount).toBeCloseTo(12.34, 2);
    });
  });

  describe('add', () => {
    test('add method returns new Money with correct sum for same currency', () => {
      const a = new Money(10.0, MoneyCurrency.USD);
      const b = new Money(5.25, MoneyCurrency.USD);
      const result = a.add(b);
      expect(result.amount).toBeCloseTo(15.25, 2);
      expect(result.currency).toBe(MoneyCurrency.USD);
    });

    test('add throws CurrencyMismatchError for different currencies', () => {
      const a = new Money(10.0, MoneyCurrency.USD);
      const b = new Money(5.0, MoneyCurrency.BRL);
      expect(() => a.add(b)).toThrow(CurrencyMismatchError);
    });
  });

  describe('subtract', () => {
    test('subtract method returns new Money with correct difference for same currency', () => {
      const a = new Money(10.0, MoneyCurrency.USD);
      const b = new Money(3.25, MoneyCurrency.USD);
      const result = a.subtract(b);
      expect(result.amount).toBeCloseTo(6.75, 2);
      expect(result.currency).toBe(MoneyCurrency.USD);
    });

    test('subtract throws CurrencyMismatchError for different currencies', () => {
      const a = new Money(10.0, MoneyCurrency.USD);
      const b = new Money(3.0, MoneyCurrency.BRL);
      expect(() => a.subtract(b)).toThrow(CurrencyMismatchError);
    });
  });

  describe('multiply', () => {
    test('multiply returns new Money with correct product', () => {
      const a = new Money(4.5, MoneyCurrency.BRL);
      const result = a.multiply(2);
      expect(result.amount).toBeCloseTo(9.0, 2);
    });

    test('multiply throws InvalidArgumentError for NaN or non-finite factor', () => {
      const a = new Money(4.5, MoneyCurrency.BRL);
      expect(() => a.multiply(NaN)).toThrow(InvalidArgumentError);
      expect(() => a.multiply(Infinity)).toThrow(InvalidArgumentError);
    });
  });

  describe('divide', () => {
    test('divide returns new Money with correct quotient', () => {
      const a = new Money(9.0, MoneyCurrency.BRL);
      const result = a.divide(3);
      expect(result.amount).toBeCloseTo(3.0, 2);
    });

    test('divide throws DivisionByZeroError for divisor zero', () => {
      const a = new Money(9.0, MoneyCurrency.USD);
      expect(() => a.divide(0)).toThrow(DivisionByZeroError);
    });

    test('divide throws InvalidArgumentError for NaN or non-finite divisor', () => {
      const a = new Money(9.0, MoneyCurrency.USD);
      expect(() => a.divide(NaN)).toThrow(InvalidArgumentError);
      expect(() => a.divide(Infinity)).toThrow(InvalidArgumentError);
    });
  });

  describe('equals', () => {
    test('equals returns true for equal amounts and currency', () => {
      const a = new Money(5.55, MoneyCurrency.USD);
      const b = new Money(5.55, MoneyCurrency.USD);
      expect(a.equals(b)).toBe(true);
    });

    test('equals returns false for different amounts or currency', () => {
      const a = new Money(5.55, MoneyCurrency.USD);
      const b = new Money(5.54, MoneyCurrency.USD);
      const c = new Money(5.55, MoneyCurrency.BRL);
      expect(a.equals(b)).toBe(false);
      expect(a.equals(c)).toBe(false);
    });
  });

  describe('greaterThan and lessThan', () => {
    test('greaterThan and lessThan work correctly', () => {
      const a = new Money(7.0, MoneyCurrency.BRL);
      const b = new Money(5.0, MoneyCurrency.BRL);
      expect(a.greaterThan(b)).toBe(true);
      expect(b.lessThan(a)).toBe(true);
    });

    test('greaterThan throws CurrencyMismatchError for different currencies', () => {
      const a = new Money(7.0, MoneyCurrency.BRL);
      const b = new Money(5.0, MoneyCurrency.USD);
      expect(() => a.greaterThan(b)).toThrow(CurrencyMismatchError);
    });
  });

  describe('format', () => {
    test('format returns correct string in default locale', () => {
      const a = new Money(1234.56, MoneyCurrency.USD);
      const formatted = a.format();
      // Depending on environment, it should include "$1,234.56"
      expect(formatted).toMatch(/\$1,234\.56/);
    });
  });

  describe('convertTo', () => {
    test('convertTo returns new Money in target currency with correct amount', () => {
      const a = new Money(10.0, MoneyCurrency.BRL);
      const rate = 0.2; // 1 BRL = 0.20 USD
      const converted = a.convertTo(MoneyCurrency.USD, rate);
      expect(converted.currency).toBe(MoneyCurrency.USD);
      expect(converted.amount).toBeCloseTo(2.0, 2);
    });

    test('convertTo throws InvalidArgumentError for invalid rate', () => {
      const a = new Money(10.0, MoneyCurrency.BRL);
      expect(() => a.convertTo(MoneyCurrency.USD, NaN)).toThrow(
        InvalidArgumentError,
      );
      expect(() => a.convertTo(MoneyCurrency.USD, -5)).toThrow(
        InvalidArgumentError,
      );
    });
  });
});
