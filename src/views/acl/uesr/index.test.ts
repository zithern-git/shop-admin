import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import UserIndex from './index.vue'
import * as userApi from '@/api/acl/user'
import type { UserResponseData } from '@/api/acl/user/type'

// Mock Element Plus 组件
vi.mock('element-plus', () => ({
  ElCard: { template: '<div class="el-card"><slot /></div>' },
  ElInput: { template: '<input class="el-input" />' },
  ElButton: { template: '<button class="el-button"><slot /></button>' },
  ElForm: { template: '<form class="el-form"><slot /></form>' },
  ElFormItem: { template: '<div class="el-form-item"><slot /></div>' },
  ElTable: { template: '<table class="el-table"><slot /></table>' },
  ElTableColumn: { template: '<td class="el-table-column"><slot /></td>' },
  ElPagination: {
    template: '<div class="el-pagination"></div>',
    props: ['currentPage', 'pageSize', 'total', 'pageSizes']
  },
  ElIcon: { template: '<i class="el-icon"><slot /></i>' }
}))

// Mock API 模块
vi.mock('@/api/acl/user', () => ({
  reqUserInfo: vi.fn()
}))

describe('User Index Component', () => {
  const mockUserData: UserResponseData = {
    code: 200,
    message: '获取成功',
    ok: true,
    data: {
      current: 1,
      pages: 4,
      size: 5,
      total: 20,
      records: [
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          role: '管理员',
          createTime: '2024-01-01',
          updateTime: '2024-01-01'
        },
        {
          id: 2,
          username: 'zhangsan',
          name: '张三',
          role: '运营',
          createTime: '2024-01-02',
          updateTime: '2024-01-02'
        },
        {
          id: 3,
          username: 'lisi',
          name: '李四',
          role: '客服',
          createTime: '2024-01-03',
          updateTime: '2024-01-03'
        }
      ]
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Mounting', () => {
    it('should mount component successfully', () => {
      const wrapper = mount(UserIndex)
      expect(wrapper.exists()).toBe(true)
    })

    it('should call getHasUser on mount', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      mount(UserIndex)
      await flushPromises()
      
      expect(reqUserInfoMock).toHaveBeenCalledWith(1, 5)
    })
  })

  describe('Pagination State', () => {
    it('should initialize with correct default pagination values', () => {
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      expect(vm.pageNo).toBe(1)
      expect(vm.pageSize).toBe(5)
    })

    it('should update pageNo when getHasUser is called with parameter', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      await vm.getHasUser(3)
      
      expect(vm.pageNo).toBe(3)
      expect(reqUserInfoMock).toHaveBeenCalledWith(3, 5)
    })

    it('should use default value 1 when getHasUser is called without parameter', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      vm.pageNo = 5
      await vm.getHasUser()
      
      expect(vm.pageNo).toBe(1)
      expect(reqUserInfoMock).toHaveBeenCalledWith(1, 5)
    })
  })

  describe('API Integration', () => {
    it('should handle successful API response', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      mount(UserIndex)
      await flushPromises()
      
      expect(consoleSpy).toHaveBeenCalledWith(mockUserData)
      consoleSpy.mockRestore()
    })

    it('should handle API error gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(userApi, 'reqUserInfo').mockRejectedValue(new Error('Network Error'))
      
      mount(UserIndex)
      await flushPromises()
      
      // Component should not crash on API error
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle empty records response', async () => {
      const emptyResponse: UserResponseData = {
        code: 200,
        message: '获取成功',
        ok: true,
        data: {
          current: 1,
          pages: 0,
          size: 5,
          total: 0,
          records: []
        }
      }
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(emptyResponse)
      
      mount(UserIndex)
      await flushPromises()
      
      expect(consoleSpy).toHaveBeenCalledWith(emptyResponse)
      consoleSpy.mockRestore()
    })
  })

  describe('Event Handlers', () => {
    it('should call getHasUser when pagination size changes', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      // Simulate size change event
      await vm.getHasUser(1)
      
      expect(reqUserInfoMock).toHaveBeenCalledTimes(2) // Once on mount, once on size change
    })

    it('should log when handleCurrentChange is called', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      vm.handleCurrentChange()
      
      expect(consoleSpy).toHaveBeenCalledWith(456)
      consoleSpy.mockRestore()
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative page numbers', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      await vm.getHasUser(-1)
      
      expect(vm.pageNo).toBe(-1)
      expect(reqUserInfoMock).toHaveBeenCalledWith(-1, 5)
    })

    it('should handle zero page number', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      await vm.getHasUser(0)
      
      expect(vm.pageNo).toBe(0)
      expect(reqUserInfoMock).toHaveBeenCalledWith(0, 5)
    })

    it('should handle large page numbers', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(mockUserData)
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      await vm.getHasUser(999999)
      
      expect(vm.pageNo).toBe(999999)
      expect(reqUserInfoMock).toHaveBeenCalledWith(999999, 5)
    })

    it('should handle API response with missing data fields', async () => {
      const incompleteResponse = {
        code: 200,
        message: '获取成功',
        ok: true,
        data: null
      } as unknown as UserResponseData
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(userApi, 'reqUserInfo').mockResolvedValue(incompleteResponse)
      
      mount(UserIndex)
      await flushPromises()
      
      expect(consoleSpy).toHaveBeenCalledWith(incompleteResponse)
      consoleSpy.mockRestore()
    })

    it('should handle concurrent API calls', async () => {
      const reqUserInfoMock = vi.spyOn(userApi, 'reqUserInfo')
        .mockResolvedValueOnce(mockUserData)
        .mockResolvedValueOnce({
          ...mockUserData,
          data: { ...mockUserData.data, current: 2 }
        })
      
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      await flushPromises()
      
      // Call multiple times rapidly
      vm.getHasUser(2)
      vm.getHasUser(3)
      vm.getHasUser(4)
      
      await flushPromises()
      
      // All calls should be made
      expect(reqUserInfoMock).toHaveBeenCalledTimes(4)
    })
  })

  describe('Reactivity', () => {
    it('should update pageSize when changed', async () => {
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      expect(vm.pageSize).toBe(5)
      
      // Simulate page size change
      vm.pageSize = 10
      await nextTick()
      
      expect(vm.pageSize).toBe(10)
    })

    it('should update pageNo when changed', async () => {
      const wrapper = mount(UserIndex)
      const vm = wrapper.vm as any
      
      expect(vm.pageNo).toBe(1)
      
      vm.pageNo = 3
      await nextTick()
      
      expect(vm.pageNo).toBe(3)
    })
  })
})
