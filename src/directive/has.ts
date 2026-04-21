import useUserStore from '@/store/modules/user'

export const hasButtons = (app: any) => {
  // 全局自定义指令，实现按钮的权限
  app.directive('has', {
    // 代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    mounted(el: HTMLElement, options: any) {
      const userStore = useUserStore()
      // 没有权限就移除按钮：
      if (!userStore.buttons.includes(options.value)) {
        // el.parentNode?.removeChild(el)
        el.remove()
      }
    },
  })
}
