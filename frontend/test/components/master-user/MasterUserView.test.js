import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MasterUserView from '@/components/master-user/MasterUserView.vue'
import Antd from 'ant-design-vue'

// Hoisted mocks
const { mockApiGet, mockApiDelete } = vi.hoisted(() => ({
  mockApiGet: vi.fn(),
  mockApiDelete: vi.fn()
}))

// Mock Api service
vi.mock('@/services/Api.js', () => ({
  default: {
    get: mockApiGet,
    delete: mockApiDelete
  }
}))

// Mock Ant Design Vue
vi.mock('ant-design-vue', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      destroy: vi.fn()
    },
    Modal: {
      confirm: vi.fn()
    }
  }
})

// Mock environment variables
vi.stubEnv('VITE_APP_URL', 'http://localhost:8000')

describe('MasterUserView', () => {
  let wrapper

  const mockUserData = {
    data: {
      data: {
        data: [
          {
            master_users_id: 1,
            id: 'USR001',
            nama: 'John Doe',
            foto: 'uploads/john.jpg',
            skpd: 'IT Department',
            status: 'Aktif',
            user: {
              username: 'johndoe',
              email: 'john@example.com',
              role: 'Admin'
            }
          },
          {
            master_users_id: 2,
            id: 'USR002',
            nama: 'Jane Smith',
            foto: 'storage/jane.jpg',
            skpd: 'HR Department',
            status: 'Suspend',
            user: {
              username: 'janesmith',
              email: 'jane@example.com',
              role: 'User'
            }
          }
        ],
        total: 2,
        current_page: 1,
        per_page: 10
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  const createWrapper = () => {
    return mount(MasterUserView, {
      global: {
        plugins: [Antd],
        stubs: {
          CustomTable: true,
          AddUser: true,
          EditUser: true
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render custom table', () => {
      wrapper = createWrapper()
      
      const table = wrapper.findComponent({ name: 'CustomTable' })
      expect(table.exists()).toBe(true)
    })

    it('should render search input', () => {
      wrapper = createWrapper()
      
      const searchInput = wrapper.find('input[placeholder="Search..."]')
      expect(searchInput.exists()).toBe(true)
    })

    it('should render Add User button', () => {
      wrapper = createWrapper()
      
      expect(wrapper.text()).toContain('Add User')
    })

    it('should render AddUser component', () => {
      wrapper = createWrapper()
      
      const addUser = wrapper.findComponent({ name: 'AddUser' })
      expect(addUser.exists()).toBe(true)
    })

    it('should render EditUser component', () => {
      wrapper = createWrapper()
      
      const editUser = wrapper.findComponent({ name: 'EditUser' })
      expect(editUser.exists()).toBe(true)
    })
  })

  describe('Initial State', () => {
    it('should initialize with empty data', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.dataTable).toEqual([])
      expect(wrapper.vm.totalItems).toBe(0)
      expect(wrapper.vm.currentPage).toBe(1)
      expect(wrapper.vm.pageSize).toBe(10)
      expect(wrapper.vm.search).toBe('')
    })

    it('should have correct columns structure', () => {
      wrapper = createWrapper()
      
      const columns = wrapper.vm.columns
      
      expect(columns).toHaveLength(8)
      expect(columns[0]).toMatchObject({ title: 'Id', dataIndex: 'id', width: 150 })
      expect(columns[1]).toMatchObject({ title: 'Nama', dataIndex: 'nama' })
      expect(columns[7]).toMatchObject({ title: 'Action', key: 'action', width: 120 })
    })
  })

  describe('Data Fetching', () => {
    it('should fetch data on mount', async () => {
      mockApiGet.mockResolvedValueOnce(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-user', {
        params: {
          page_size: 10,
          page: 1,
          search: undefined
        }
      })
    })

    it('should update table data after fetch', async () => {
      mockApiGet.mockResolvedValueOnce(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.vm.dataTable).toEqual(mockUserData.data.data.data)
      expect(wrapper.vm.totalItems).toBe(2)
      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('should fetch data with search parameter', async () => {
      mockApiGet.mockResolvedValueOnce(mockUserData)
      
      wrapper = createWrapper()
      wrapper.vm.search = 'john'
      await wrapper.vm.fetchData()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-user', {
        params: {
          page_size: 10,
          page: 1,
          search: 'john'
        }
      })
    })

    it('should not send empty search parameter', async () => {
      mockApiGet.mockResolvedValueOnce(mockUserData)
      
      wrapper = createWrapper()
      wrapper.vm.search = '   '
      await wrapper.vm.fetchData()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-user', {
        params: {
          page_size: 10,
          page: 1,
          search: undefined
        }
      })
    })
  })

  describe('Search Functionality', () => {
    it('should trigger fetch when search value changes', async () => {
      mockApiGet.mockResolvedValue(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      wrapper.vm.search = 'jane'
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalled()
    })

    it('should reset to page 1 when searching', async () => {
      mockApiGet.mockResolvedValue(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      wrapper.vm.currentPage = 3
      wrapper.vm.search = 'test'
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-user', {
        params: {
          page_size: 10,
          page: 1,
          search: 'test'
        }
      })
    })
  })

  describe('Modal Operations', () => {
    it('should open add user modal', () => {
      wrapper = createWrapper()
      
      const addUserRef = {
        openModal: vi.fn()
      }
      wrapper.vm.addUserRef = addUserRef
      
      wrapper.vm.openAddUser()
      
      expect(addUserRef.openModal).toHaveBeenCalled()
    })

    it('should open edit user modal with record', () => {
      wrapper = createWrapper()
      
      const editUserRef = {
        openModal: vi.fn()
      }
      wrapper.vm.editUserRef = editUserRef
      
      const record = mockUserData.data.data.data[0]
      wrapper.vm.openEditUser(record)
      
      expect(editUserRef.openModal).toHaveBeenCalledWith(record)
    })
  })

  describe('Delete Functionality', () => {
    it('should show confirmation modal on delete', async () => {
      const { Modal } = await import('ant-design-vue')
      wrapper = createWrapper()
      
      const record = mockUserData.data.data.data[0]
      wrapper.vm.handleDelete(record)
      
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('should delete user successfully', async () => {
      const { Modal, message } = await import('ant-design-vue')
      mockApiDelete.mockResolvedValueOnce({
        data: { status: true, message: 'User berhasil dihapus' }
      })
      mockApiGet.mockResolvedValueOnce(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      const record = mockUserData.data.data.data[0]
      wrapper.vm.handleDelete(record)
      
      const confirmConfig = Modal.confirm.mock.calls[0][0]
      await confirmConfig.onOk()
      await flushPromises()
      
      expect(mockApiDelete).toHaveBeenCalledWith('/master-user/1')
      expect(message.success).toHaveBeenCalled()
    })

    it('should handle delete error', async () => {
      const { Modal, message } = await import('ant-design-vue')
      mockApiDelete.mockResolvedValueOnce({
        data: { status: false, message: 'Gagal menghapus user' }
      })
      
      wrapper = createWrapper()
      
      const record = mockUserData.data.data.data[0]
      wrapper.vm.handleDelete(record)
      
      const confirmConfig = Modal.confirm.mock.calls[0][0]
      await confirmConfig.onOk()
      await flushPromises()
      
      expect(message.error).toHaveBeenCalled()
    })
  })

  describe('Pagination', () => {
    it('should handle page change', async () => {
      mockApiGet.mockResolvedValue(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageChange(2)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-user', {
        params: {
          page_size: 10,
          page: 2,
          search: undefined
        }
      })
    })

    it('should handle page size change', async () => {
      mockApiGet.mockResolvedValue(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageSizeChange(20)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-user', {
        params: {
          page_size: 20,
          page: 1,
          search: undefined
        }
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle fetch error', async () => {
      const { message } = await import('ant-design-vue')
      const errorMessage = 'Network error'
      mockApiGet.mockRejectedValueOnce({ message: errorMessage })
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(message.error).toHaveBeenCalledWith(errorMessage)
    })

    it('should show default error message when no message provided', async () => {
      const { message } = await import('ant-design-vue')
      mockApiGet.mockRejectedValueOnce({})
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(message.error).toHaveBeenCalledWith('Gagal mengambil data')
    })
  })

  describe('Status Tag Colors', () => {
    it('should return correct colors for all statuses', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.getStatusTagColor('Aktif')).toBe('green')
      expect(wrapper.vm.getStatusTagColor('Suspend')).toBe('orange')
      expect(wrapper.vm.getStatusTagColor('Tidak Aktif')).toBe('red')
      expect(wrapper.vm.getStatusTagColor('Unknown')).toBe('default')
    })
  })

  describe('Event Handling', () => {
    it('should refetch data after saved event from AddUser', async () => {
      mockApiGet.mockResolvedValue(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      
      const addUser = wrapper.findComponent({ name: 'AddUser' })
      await addUser.vm.$emit('saved')
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalled()
    })

    it('should refetch data after saved event from EditUser', async () => {
      mockApiGet.mockResolvedValue(mockUserData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      
      const editUser = wrapper.findComponent({ name: 'EditUser' })
      await editUser.vm.$emit('saved')
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalled()
    })
  })
})