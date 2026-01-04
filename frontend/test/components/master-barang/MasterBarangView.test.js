import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MasterBarangView from '@/components/master-barang/MasterBarangView.vue'
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

describe('MasterBarangView', () => {
  let wrapper

  const mockBarangData = {
    data: {
      data: {
        data: [
          {
            master_barang_id: 1,
            seri: 'SN001',
            barang: 'Laptop Dell',
            gambar: 'uploads/laptop.jpg',
            pengadaan: '2024-01-15',
            pemeliharaan: '2024-06-15',
            harga: 15000000,
            kategori: 'Elektronik',
            status: 'Baik'
          }
        ],
        total: 1,
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
    return mount(MasterBarangView, {
      global: {
        plugins: [Antd],
        stubs: {
          CustomTable: true,
          AddBarang: true,
          EditBarang: true
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

    it('should render Add Barang button', () => {
      wrapper = createWrapper()
      
      expect(wrapper.text()).toContain('Add Barang')
    })
  })

  describe('Initial State', () => {
    it('should initialize with empty data', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.dataTable).toEqual([])
      expect(wrapper.vm.totalItems).toBe(0)
      expect(wrapper.vm.search).toBe('')
    })

    it('should have correct columns structure', () => {
      wrapper = createWrapper()
      
      const columns = wrapper.vm.columns
      
      expect(columns).toHaveLength(8)
      expect(columns[0]).toMatchObject({ title: 'No. Seri', dataIndex: 'seri' })
      expect(columns[7]).toMatchObject({ title: 'Action', key: 'action' })
    })
  })

  describe('Data Fetching', () => {
    it('should fetch data on mount', async () => {
      mockApiGet.mockResolvedValueOnce(mockBarangData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-barang', {
        params: {
          page_size: 10,
          page: 1,
          search: undefined
        }
      })
    })

    it('should update table data after fetch', async () => {
      mockApiGet.mockResolvedValueOnce(mockBarangData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.vm.dataTable).toEqual(mockBarangData.data.data.data)
      expect(wrapper.vm.totalItems).toBe(1)
    })

    it('should fetch data with search parameter', async () => {
      mockApiGet.mockResolvedValueOnce(mockBarangData)
      
      wrapper = createWrapper()
      wrapper.vm.search = 'laptop'
      await wrapper.vm.fetchData()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-barang', {
        params: {
          page_size: 10,
          page: 1,
          search: 'laptop'
        }
      })
    })
  })

  describe('Search Functionality', () => {
    it('should trigger fetch when search value changes', async () => {
      mockApiGet.mockResolvedValue(mockBarangData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      wrapper.vm.search = 'printer'
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalled()
    })
  })

  describe('Modal Operations', () => {
    it('should open add barang modal', () => {
      wrapper = createWrapper()
      
      const addBarangRef = {
        openModal: vi.fn()
      }
      wrapper.vm.addBarangRef = addBarangRef
      
      wrapper.vm.openAddBarang()
      
      expect(addBarangRef.openModal).toHaveBeenCalled()
    })

    it('should open edit barang modal with record', () => {
      wrapper = createWrapper()
      
      const editBarangRef = {
        openModal: vi.fn()
      }
      wrapper.vm.editBarangRef = editBarangRef
      
      const record = mockBarangData.data.data.data[0]
      wrapper.vm.openEditBarang(record)
      
      expect(editBarangRef.openModal).toHaveBeenCalledWith(record)
    })
  })

  describe('Delete Functionality', () => {
    it('should show confirmation modal on delete', async () => {
      const { Modal } = await import('ant-design-vue')
      wrapper = createWrapper()
      
      const record = mockBarangData.data.data.data[0]
      wrapper.vm.handleDelete(record)
      
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('should delete item successfully', async () => {
      const { Modal, message } = await import('ant-design-vue')
      mockApiDelete.mockResolvedValueOnce({
        data: { status: true, message: 'Data berhasil dihapus' }
      })
      mockApiGet.mockResolvedValueOnce(mockBarangData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      const record = mockBarangData.data.data.data[0]
      wrapper.vm.handleDelete(record)
      
      const confirmConfig = Modal.confirm.mock.calls[0][0]
      await confirmConfig.onOk()
      await flushPromises()
      
      expect(mockApiDelete).toHaveBeenCalledWith('/master-barang/1')
      expect(message.success).toHaveBeenCalled()
    })
  })

  describe('Pagination', () => {
    it('should handle page change', async () => {
      mockApiGet.mockResolvedValue(mockBarangData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageChange(2)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/master-barang', {
        params: {
          page_size: 10,
          page: 2,
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
  })

  describe('Status Tag Colors', () => {
    it('should return correct colors for status', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.getStatusTagColor('Baik')).toBe('green')
      expect(wrapper.vm.getStatusTagColor('Pemeliharaan')).toBe('orange')
      expect(wrapper.vm.getStatusTagColor('Rusak')).toBe('red')
    })
  })
})