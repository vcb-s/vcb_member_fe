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

async function async() {
  await Promise.resolve()
}

function sagasCreator (
  func: (builder: ActionMapBuilder) => void
) {
  const sagasMap: Map<string, (action: Action) => Promise<void>> = new Map()
  const sagasRuner = (action: Action) => {
    if (sagasMap.has(action.type)) {
      /**
       * @TODO 这里其实不确定dispatch后是否会有异步间隙
       *
       * @desc
       * 根据简单conosle顺序测试，
       * dispatch后下一行console得到的store是更新后的，
       * 函数组件也已经跑过一次
       *
       * 所以这里的then按推理是可以去掉的，纯粹是一个安心感
       */
      return sagasMap.get(action.type)(action).then(async)
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
