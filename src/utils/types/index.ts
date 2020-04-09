import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';

/**
 * 类型互斥
 *
 * @url https://zhuanlan.zhihu.com/p/82459341
 * @url https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604
 *
 * @example
 * ```typescript
 * interface A { a: string }
 * interface B { b: string }
 * interface C { c: number, d: string }
 * interface D { c: number, d: string }
 * type AorB = XOR<A, B>
 * type AorBorC = XOR<A, XOR<B, C>>
 * type CorD = XOR<C, D>
 *
 * const var1: AorB = { a: '' } // pass
 * const var2: AorB = { a: '', b: '' } // error
 * const var3: AorB = { a: '', c: '' } // error
 * const var4: AorBorC = { a: '', c: '' } // error
 * const var5: CorD = { c: '', d: '' } // error
 * ```
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export interface Action<T extends any = any> extends AnyAction {
  payload: T;
}

export type Effect = <A extends Action = Action>(
  action: A,
  effects: EffectsCommandMap,
) => void;
export type Reducer<S = any, A extends Action = Action> = (
  state: S,
  action: A,
) => void;

export function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

export type Promised<S extends Promise<any>> = S extends Promise<infer RT>
  ? RT
  : never;

export enum GO_BOOL {
  yes = 1,
  no = 2,
}

export function PromisedType<T extends any>(promise: Promise<T>): T {
  return (promise as any) as T;
}
