export interface ScrollNavProvide <T = string> {
  current: Ref<T | undefined>
  updateCurrent: (current: T) => void
  bind: (name: T, ref: Ref<HTMLElement | undefined>) => void
}
