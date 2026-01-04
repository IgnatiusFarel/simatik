import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ReportBarangView from '@/components/report-barang/ReportBarangView.vue'
import Antd from 'ant-design-vue'
import dayjs from 'dayjs'

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
      warning: vi.fn(),
      destroy: vi.fn()
    }
  }
})

// Mock environment variables
vi.stubEnv('VITE_APP_URL', 'http://localhost:8000')

// Mock window.URL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('ReportBarangView', () => {
  let wrapper

  const mockReportData = {
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

  beforeEach(() => {
    vi.clearAllMocks()
    global.open = vi.fn()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  const createWrapper = () => {
    return mount(ReportBarangView, {
      global: {
        plugins: [Antd],
        stubs: {
          CustomTable: true
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

    it('should render Print PDF button', () => {
      wrapper = createWrapper()
      
      expect(wrapper.text()).toContain('Print PDF')
    })
  })

  describe('Initial State', () => {
    it('should initialize with empty data', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.dataTable).toEqual([])
      expect(wrapper.vm.totalItems).toBe(0)
      expect(wrapper.vm.currentPage).toBe(1)
      expect(wrapper.vm.pageSize).toBe(10)
      expect(wrapper.vm.selectedDateRange).toBeNull()
    })

    it('should have correct columns structure', () => {
      wrapper = createWrapper()
      
      const columns = wrapper.vm.columns
      
      expect(columns).toHaveLength(7)
      expect(columns[0]).toMatchObject({ title: 'No. Seri', dataIndex: 'seri' })
      expect(columns[1]).toMatchObject({ title: 'Barang', dataIndex: 'barang' })
      expect(columns[6]).toMatchObject({ title: 'Status', dataIndex: 'status' })
    })
  })

  describe('Data Fetching', () => {
    it('should fetch data on mount', async () => {
      mockApiGet.mockResolvedValueOnce(mockReportData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang', {
        params: {
          page_size: 10,
          page: 1
        }
      })
    })

    it('should update table data after fetch', async () => {
      mockApiGet.mockResolvedValueOnce(mockReportData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.vm.dataTable).toEqual(mockReportData.data.data.data)
      expect(wrapper.vm.totalItems).toBe(2)
      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('should fetch data with date range parameters', async () => {
      mockApiGet.mockResolvedValueOnce(mockReportData)
      
      wrapper = createWrapper()
      
      const startDate = dayjs('2024-01-01')
      const endDate = dayjs('2024-12-31')
      wrapper.vm.selectedDateRange = [startDate, endDate]
      
      await wrapper.vm.fetchData()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang', {
        params: {
          page_size: 10,
          page: 1,
          from: '2024-01-01',
          to: '2024-12-31'
        }
      })
    })

    it('should not send date parameters when range is not selected', async () => {
      mockApiGet.mockResolvedValueOnce(mockReportData)
      
      wrapper = createWrapper()
      wrapper.vm.selectedDateRange = null
      
      await wrapper.vm.fetchData()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang', {
        params: {
          page_size: 10,
          page: 1
        }
      })
    })
  })

  describe('Date Range Filtering', () => {
    it('should trigger fetch when date range changes', async () => {
      mockApiGet.mockResolvedValue(mockReportData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      
      const startDate = dayjs('2024-01-01')
      const endDate = dayjs('2024-12-31')
      wrapper.vm.selectedDateRange = [startDate, endDate]
      
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalled()
    })

    it('should reset to page 1 when date range changes', async () => {
      mockApiGet.mockResolvedValue(mockReportData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      wrapper.vm.currentPage = 3
      
      const startDate = dayjs('2024-01-01')
      const endDate = dayjs('2024-12-31')
      wrapper.vm.selectedDateRange = [startDate, endDate]
      
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang', {
        params: {
          page_size: 10,
          page: 1,
          from: '2024-01-01',
          to: '2024-12-31'
        }
      })
    })
  })

  describe('Print PDF Functionality', () => {
    it('should show warning when date range is not selected', async () => {
      const { message } = await import('ant-design-vue')
      wrapper = createWrapper()
      wrapper.vm.selectedDateRange = null
      
      await wrapper.vm.handlePrint()
      
      expect(message.warning).toHaveBeenCalledWith('Pilih rentang tanggal yang mau di print terlebih dahulu!')
    })

    it('should show warning when date range is incomplete', async () => {
      const { message } = await import('ant-design-vue')
      wrapper = createWrapper()
      wrapper.vm.selectedDateRange = [dayjs('2024-01-01')]
      
      await wrapper.vm.handlePrint()
      
      expect(message.warning).toHaveBeenCalledWith('Pilih rentang tanggal yang mau di print terlebih dahulu!')
    })

    it('should print PDF successfully', async () => {
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
      mockApiGet.mockResolvedValueOnce({
        data: mockBlob,
        headers: { 'content-type': 'application/pdf' }
      })
      
      wrapper = createWrapper()
      wrapper.vm.selectedDateRange = [dayjs('2024-01-01'), dayjs('2024-12-31')]
      wrapper.vm.dataTable = mockReportData.data.data.data
      
      await wrapper.vm.handlePrint()
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang/print', {
        params: {
          from: '2024-01-01',
          to: '2024-12-31'
        },
        responseType: 'blob'
      })
      
      expect(global.open).toHaveBeenCalledWith('blob:mock-url', '_blank')
    })

    it('should handle print error', async () => {
      const { message } = await import('ant-design-vue')
      mockApiGet.mockRejectedValueOnce(new Error('Network error'))
      
      wrapper = createWrapper()
      wrapper.vm.selectedDateRange = [dayjs('2024-01-01'), dayjs('2024-12-31')]
      wrapper.vm.dataTable = mockReportData.data.data.data
      
      await wrapper.vm.handlePrint()
      await flushPromises()
      
      expect(message.error).toHaveBeenCalledWith('Print PDF data barang gagal dicetak!')
    })

    it('should show loading during print', async () => {
      mockApiGet.mockImplementation(() => new Promise(resolve => setTimeout(() => {
        resolve({
          data: new Blob(['pdf'], { type: 'application/pdf' }),
          headers: { 'content-type': 'application/pdf' }
        })
      }, 100)))
      
      wrapper = createWrapper()
      wrapper.vm.selectedDateRange = [dayjs('2024-01-01'), dayjs('2024-12-31')]
      wrapper.vm.dataTable = mockReportData.data.data.data
      
      const printPromise = wrapper.vm.handlePrint()
      
      expect(wrapper.vm.loading).toBe(true)
      
      await printPromise
      await flushPromises()
      
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('Pagination', () => {
    it('should handle page change', async () => {
      mockApiGet.mockResolvedValue(mockReportData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageChange(2)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang', {
        params: {
          page_size: 10,
          page: 2
        }
      })
    })

    it('should handle page size change', async () => {
      mockApiGet.mockResolvedValue(mockReportData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageSizeChange(20)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang', {
        params: {
          page_size: 20,
          page: 1
        }
      })
    })

    it('should maintain date range in pagination', async () => {
      mockApiGet.mockResolvedValue(mockReportData)
      
      wrapper = createWrapper()
      wrapper.vm.selectedDateRange = [dayjs('2024-01-01'), dayjs('2024-12-31')]
      await flushPromises()
      
      mockApiGet.mockClear()
      await wrapper.vm.handlePageChange(2)
      await flushPromises()
      
      expect(mockApiGet).toHaveBeenCalledWith('/report-barang', {
        params: {
          page_size: 10,
          page: 2,
          from: '2024-01-01',
          to: '2024-12-31'
        }
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading during data fetch', async () => {
      mockApiGet.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockReportData), 100)))
      
      wrapper = createWrapper()
      
      expect(wrapper.vm.loading).toBe(true)
      
      await flushPromises()
      
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should set loading to false after fetch completes', async () => {
      mockApiGet.mockResolvedValueOnce(mockReportData)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.vm.loading).toBe(false)
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
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should show default error message when no message provided', async () => {
      const { message } = await import('ant-design-vue')
      mockApiGet.mockRejectedValueOnce({})
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(message.error).toHaveBeenCalledWith('Gagal mengambil data')
    })

    it('should call message.destroy before showing error', async () => {
      const { message } = await import('ant-design-vue')
      mockApiGet.mockRejectedValueOnce({ message: 'Error' })
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(message.destroy).toHaveBeenCalled()
    })
  })

  describe('Status Tag Colors', () => {
    it('should return correct colors for status', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.getStatusTagColor('Baik')).toBe('green')
      expect(wrapper.vm.getStatusTagColor('Pemeliharaan')).toBe('orange')
      expect(wrapper.vm.getStatusTagColor('Rusak')).toBe('red')
      expect(wrapper.vm.getStatusTagColor('Unknown')).toBe('default')
    })
  })
})