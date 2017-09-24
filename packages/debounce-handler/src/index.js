import { Component } from 'react'
import { createEagerFactory, setDisplayName, wrapDisplayName } from 'recompose'
import debounce from 'just-debounce-it'

const debounceHandler = (handlerName, delay, leadingCall) => (Target) => {
  const factory = createEagerFactory(Target)

  class DebounceHandler extends Component {
    constructor (props, context) {
      super(props, context)

      const debounced = debounce(props[handlerName], delay, leadingCall)

      this[handlerName] = (e, ...rest) => {
        if (e && typeof e.persist === 'function') {
          e.persist()
        }

        return debounced(e, ...rest)
      }
    }

    render () {
      return factory({
        ...this.props,
        [handlerName]: this[handlerName]
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Target, 'debounceHandler'))(DebounceHandler)
  }

  return DebounceHandler
}

export default debounceHandler
