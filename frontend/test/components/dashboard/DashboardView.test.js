import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DashboardView from '@/components/dashboard/DashboardView.vue'
import Antd from 'ant-design-vue'

// Hoisted mock
const { mockApiGet } = vi.hoisted(() => ({
  mockApiGet: vi.fn()
}))

// Mock Api service
vi.mock('@/services/Api.js', () => ({
  default: {
    get: mockApiGet
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
    }
  }
})

// Mock environment variables
vi.stubEnv('VITE_APP_URL', 'http://localhost:8000')

describe('DashboardView', () => {
  let wrapper

  const mockDashboardData = {
    data: {
      data: {
        data: [
          {
            id: 1,
            seri: 'SN001',
            barang: 'Laptop Dell',
            gambar: 'uploads/laptop.jpg',
            pengadaan: '2024-01-15',
            pemeliharaan: '2024-06-15',
            harga: 15000000,
            kategori: 'Elektronik',
            status: 'Baik'
          },
          {
            id: 2,
            seri: 'SN002',
            barang: 'Printer HP',
            gambar: 'storage/printer.jpg',
            pengadaan: '2024-02-20',
            pemeliharaan: null,
            harga: 3000000,
            kategori: 'Elektronik',
            status: 'Pemeliharaan'
          }
        ],
        total: 2,
        current_page: 1,
        per_page: 10
      }
    }
  }

  const mockAssetData = {
    data: {
      data: {
        baik: { jumlah: 50, persen: 60 },
        pemeliharaan: { jumlah: 25, persen: 30 },
        rusak: { jumlah: 8, persen: 10 }
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
    return mount(DashboardView, {
      global: {
        plugins: [Antd],
        stubs: {
          AssetCard: true,
          CustomTable: true
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render three asset cards', () => {
      wrapper = createWrapper()
      
      const assetCards = wrapper.findAllComponents({ name: 'AssetCard' })
      expect(assetCards).toHaveLength(3)
    })

    it('should render custom table', () => {
      wrapper = createWrapper()
      
      const table = wrapper.findComponent({ name: 'CustomTable' })
      expect(table.exists()).toBe(true)
    })

    it('should render Recent History header', () => {
      wrapper = createWrapper()
      
      expect(wrapper.text()).toContain('⏱ Recent History')
    })
  })

  describe('Initial State', () => {
    it('should initialize cards with default values', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.cards[0]).toMatchObject({
        title: 'Aset Baik',
        subTitle: 'Aset TIK',
        subtitleDesc: 'Kondisi Baik',
        total: 0,
        percentage: '0%'
      })
    })

    it('should initialize with empty data table', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.dataTable).toEqual([])
      expect(wrapper.vm.totalItems).toBe(0)
    })
  })

  describe('Data Fetching', () => {
    it('should fetch dashboard data on mount', async () => {
      mockApiGet.mockResolvedValueOnce(mockDashboardData)
      mockApiGet.mockResolvedValueOnce(mockAssetData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/dashboard', {
        params: {
          page_size: 10,
          page: 1
        }
      })
    })

    it('should update asset cards with fetched data', async () => {
      mockApiGet.mockResolvedValueOnce(mockDashboardData)
      mockApiGet.mockResolvedValueOnce(mockAssetData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.vm.cards[0].total).toBe(50)
      expect(wrapper.vm.cards[0].percentage).toBe('60%')
    })

    it('should update table data with fetched results', async () => {
      mockApiGet.mockResolvedValueOnce(mockDashboardData)
      mockApiGet.mockResolvedValueOnce(mockAssetData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.vm.dataTable).toEqual(mockDashboardData.data.data.data)
      expect(wrapper.vm.totalItems).toBe(2)
    })
  })

  describe('Pagination', () => {
    it('should handle page change', async () => {
      mockApiGet.mockResolvedValue(mockDashboardData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageChange(2)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/dashboard', {
        params: {
          page_size: 10,
          page: 2
        }
      })
    })

    it('should handle page size change', async () => {
      mockApiGet.mockResolvedValue(mockDashboardData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageSizeChange(20)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/dashboard', {
        params: {
          page_size: 20,
          page: 1
        }
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle fetch error gracefully', async () => {
      const { message } = await import('ant-design-vue')
      const errorMessage = 'Network error'
      mockApiGet.mockRejectedValueOnce({ message: errorMessage })
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(message.error).toHaveBeenCalledWith(errorMessage)
    })

    it('should display fallback error message', async () => {
      const { message } = await import('ant-design-vue')
      mockApiGet.mockRejectedValueOnce({})
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(message.error).toHaveBeenCalledWith('Gagal mengambil data')
    })
  })

  describe('Status Tag Colors', () => {
    it('should return correct colors', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.getStatusTagColor('Baik')).toBe('green')
      expect(wrapper.vm.getStatusTagColor('Pemeliharaan')).toBe('orange')
      expect(wrapper.vm.getStatusTagColor('Rusak')).toBe('red')
      expect(wrapper.vm.getStatusTagColor('Unknown')).toBe('default')
    })
  })
})