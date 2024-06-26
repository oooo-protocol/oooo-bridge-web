import { usePermission, useSupported } from '@vueuse/core'

export const useClipboard = () => {
  const permissionWrite = usePermission('clipboard-write')
  const isClipboardApiSupported = useSupported(() => (navigator != null && 'clipboard' in navigator))

  async function copy (value: string, el?: HTMLElement) {
    if (value != null) {
      if (isClipboardApiSupported.value && isAllowed(permissionWrite.value)) {
        await navigator!.clipboard.writeText(value)
      } else {
        legacyCopy(value, el)
      }
    }
  }

  function legacyCopy (value: string, el = document.body) {
    const ta = document.createElement('textarea')
    ta.value = value ?? ''
    ta.style.position = 'absolute'
    ta.style.opacity = '0'
    el.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }

  function isAllowed (status: PermissionState | undefined) {
    return status === 'granted' || status === 'prompt'
  }

  return {
    copy
  }
}
