import * as React from "react"

export interface Options {
  scroll?: boolean
  keyboard?: boolean
  pinch?: boolean
  global?: boolean
}

export interface Return {
  disableGlobal: () => void
  enableGlobal: () => void
  isGlobalDisabled: boolean
  disableForElement: (element: HTMLElement) => () => void
  enableForElement: (element: HTMLElement) => void
  toggleGlobal: () => void
}

export const usePreventZoom = (options: Options = {}): Return => {
  const {
    scroll = true,
    keyboard = true,
    pinch = true,
    global = false,
  } = options

  const [isGlobalDisabled, setIsGlobalDisabled] = React.useState(global)
  const elementListenersRef = React.useRef<Map<HTMLElement, (() => void)[]>>(
    new Map()
  )

  const handleGlobalKeydown = React.useCallback(
    (e: KeyboardEvent) => {
      if (
        isGlobalDisabled &&
        keyboard &&
        e.ctrlKey &&
        (e.key === "+" ||
          e.key === "-" ||
          e.key === "=" ||
          e.key === "0" ||
          ["61", "107", "173", "109", "187", "189", "48"].includes(
            e.keyCode.toString()
          ))
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [isGlobalDisabled, keyboard]
  )

  const handleGlobalWheel = React.useCallback(
    (e: WheelEvent) => {
      if (isGlobalDisabled && scroll && e.ctrlKey) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [isGlobalDisabled, scroll]
  )

  const handleGlobalTouchMove = React.useCallback(
    (e: TouchEvent) => {
      if (isGlobalDisabled && pinch && e.touches.length > 1) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [isGlobalDisabled, pinch]
  )

  const createElementKeydownHandler = React.useCallback(
    (element: HTMLElement) => (e: KeyboardEvent) => {
      if (
        keyboard &&
        e.ctrlKey &&
        (e.key === "+" ||
          e.key === "-" ||
          e.key === "=" ||
          e.key === "0" ||
          ["61", "107", "173", "109", "187", "189", "48"].includes(
            e.keyCode.toString()
          ))
      ) {
        if (element.contains(e.target as Node)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
    },
    [keyboard]
  )

  const createElementWheelHandler = React.useCallback(
    (element: HTMLElement) => (e: WheelEvent) => {
      if (scroll && e.ctrlKey && element.contains(e.target as Node)) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [scroll]
  )

  const createElementTouchMoveHandler = React.useCallback(
    (element: HTMLElement) => (e: TouchEvent) => {
      if (pinch && e.touches.length > 1 && element.contains(e.target as Node)) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [pinch]
  )

  const disableGlobal = React.useCallback(() => {
    setIsGlobalDisabled(true)
  }, [])

  const enableGlobal = React.useCallback(() => {
    setIsGlobalDisabled(false)
  }, [])

  const toggleGlobal = React.useCallback(() => {
    setIsGlobalDisabled((prev) => !prev)
  }, [])

  const enableForElement = React.useCallback((element: HTMLElement) => {
    if (!element) {
      console.warn("usePreventZoom: Invalid element provided")
      return
    }

    const cleanupFunctions = elementListenersRef.current.get(element)
    if (cleanupFunctions) {
      cleanupFunctions.forEach((cleanup) => cleanup())
      elementListenersRef.current.delete(element)
    }
  }, [])

  const disableForElement = React.useCallback(
    (element: HTMLElement): (() => void) => {
      if (!element) {
        console.warn("usePreventZoom: Invalid element provided")
        return () => {}
      }

      enableForElement(element)

      const keydownHandler = createElementKeydownHandler(element)
      const wheelHandler = createElementWheelHandler(element)
      const touchMoveHandler = createElementTouchMoveHandler(element)

      element.addEventListener("keydown", keydownHandler as EventListener)
      element.addEventListener("wheel", wheelHandler, { passive: false })
      element.addEventListener("touchmove", touchMoveHandler, {
        passive: false,
      })

      const cleanupFunctions = [
        () =>
          element.removeEventListener(
            "keydown",
            keydownHandler as EventListener
          ),
        () => element.removeEventListener("wheel", wheelHandler),
        () => element.removeEventListener("touchmove", touchMoveHandler),
      ]

      elementListenersRef.current.set(element, cleanupFunctions)

      return () => enableForElement(element)
    },
    [
      enableForElement,
      createElementKeydownHandler,
      createElementWheelHandler,
      createElementTouchMoveHandler,
    ]
  )

  React.useEffect(() => {
    if (isGlobalDisabled) {
      document.addEventListener("keydown", handleGlobalKeydown)
      document.addEventListener("wheel", handleGlobalWheel, { passive: false })
      document.addEventListener("touchmove", handleGlobalTouchMove, {
        passive: false,
      })

      return () => {
        document.removeEventListener("keydown", handleGlobalKeydown)
        document.removeEventListener("wheel", handleGlobalWheel)
        document.removeEventListener("touchmove", handleGlobalTouchMove)
      }
    }
  }, [
    handleGlobalKeydown,
    handleGlobalWheel,
    handleGlobalTouchMove,
    isGlobalDisabled,
  ])

  React.useEffect(() => {
    const elementListeners = elementListenersRef.current
    return () => {
      elementListeners.forEach((cleanupFunctions) => {
        cleanupFunctions.forEach((cleanup) => cleanup())
      })
      elementListeners.clear()
    }
  }, [])

  return {
    disableGlobal,
    enableGlobal,
    isGlobalDisabled,
    disableForElement,
    enableForElement,
    toggleGlobal,
  }
}
