import { Action } from 'redux'

interface TypedActionCreator<Type extends string> {
  (...args: any[]): Action<Type>;
  type: Type;
}

interface ActionMapBuilder {
  addCase<ActionCreator extends TypedActionCreator<string>>(
    actionCreator: ActionCreator,
    handle: (action: ReturnType<ActionCreator>) => Promise<void>
  ): ActionMapBuilder;
}

function sagasCreator (
  func: (builder: ActionMapBuilder) => void
) {
  const sagasMap = new Map()
  const sagasRuner = (action: Action) => {
    if (sagasMap.has(action.type)) {
      return sagasMap.get(action.type)(action)
    }

    throw new Error(`unknown sagas: ${action}`)
  }

  const builder: ActionMapBuilder = {
    addCase: (actionCreator, handle) => {
      sagasMap.set(`${actionCreator}`, handle)

      return builder
    }
  }

  func(builder)

  return sagasRuner
}

export { sagasCreator }
export default sagasCreator
