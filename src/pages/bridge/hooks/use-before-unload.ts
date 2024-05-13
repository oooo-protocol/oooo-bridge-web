/**
 * Call system alert when `onbeforeunload` is called.
 */
export const usePreventUnload = () => {
  onMounted(() => {
    window.onbeforeunload = function (e) {
      return 'Transaction is in progress, please not closed the page, otherwise you maybe lose your order'
    }
  })

  onUnmounted(() => {
    window.onbeforeunload = null
  })
}
