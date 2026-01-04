import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoginView from '@/components/auth/LoginView.vue'
import Antd from 'ant-design-vue'

// Hoisted mocks
const { mockPush, mockLogin } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockLogin: vi.fn()
}))

// Mock router
vi.mock('@/router/index.js', () => ({
  default: {
    push: mockPush
  }
}))

// Mock auth store
vi.mock('@/stores/Auth.js', () => ({
  useAuthStore: () => ({
    login: mockLogin
  })
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
    notification: {
      open: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn()
    }
  }
})

describe('LoginView', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  const createWrapper = () => {
    return mount(LoginView, {
      global: {
        plugins: [Antd]
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render login form correctly', () => {
      wrapper = createWrapper()
      
      expect(wrapper.find('form').exists()).toBe(true)
      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBeGreaterThanOrEqual(2)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('should display logo image', () => {
      wrapper = createWrapper()
      
      const logo = wrapper.find('img[alt="logo"]')
      expect(logo.exists()).toBe(true)
    })

    it('should display background image', () => {
      wrapper = createWrapper()
      
      const bgImage = wrapper.find('img[alt="background"]')
      expect(bgImage.exists()).toBe(true)
    })

    it('should have remember me checkbox', () => {
      wrapper = createWrapper()
      
      expect(wrapper.text()).toContain('Remember Me')
    })

    it('should have forgot password link', () => {
      wrapper = createWrapper()
      
      const forgotLink = wrapper.find('a[href="/forgot-password"]')
      expect(forgotLink.exists()).toBe(true)
      expect(forgotLink.text()).toContain('Forgot Password')
    })

    it('should have design credit link', () => {
      wrapper = createWrapper()
      
      const designLink = wrapper.find('a[href*="figma.com"]')
      expect(designLink.exists()).toBe(true)
      expect(designLink.text()).toContain('Design by Dinkz Nasaruddin')
      expect(designLink.attributes('target')).toBe('_blank')
    })
  })

  describe('Trial Notification', () => {
    it('should show trial notification on mount', async () => {
      const { notification } = await import('ant-design-vue')
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(notification.open).toHaveBeenCalled()
    })
  })

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      wrapper = createWrapper()
      
      const rules = wrapper.vm.rules
      
      expect(rules.login[0].required).toBe(true)
      expect(rules.login[0].message).toBe('Email atau Username wajib diisi!')
      
      expect(rules.password[0].required).toBe(true)
      expect(rules.password[0].message).toBe('Password wajib diisi!')
    })

    it('should validate password minimum length', () => {
      wrapper = createWrapper()
      
      const passwordRule = wrapper.vm.rules.password.find(rule => rule.min)
      
      expect(passwordRule.min).toBe(8)
      expect(passwordRule.message).toBe('Password minimal 8 karakter!')
    })
  })

  describe('Login Functionality', () => {
    it('should handle successful login', async () => {
      const { message } = await import('ant-design-vue')
      mockLogin.mockResolvedValueOnce()

      wrapper = createWrapper()
      
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('superadmin@gmail.com')
      await inputs[1].setValue('12345678')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(mockLogin).toHaveBeenCalledWith({
        login: 'superadmin@gmail.com',
        password: '12345678',
        remember: false
      })
      expect(message.success).toHaveBeenCalledWith('Login Berhasil!')
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle login failure with error message', async () => {
      const { message } = await import('ant-design-vue')
      const errorMessage = 'Invalid credentials'
      mockLogin.mockRejectedValueOnce({ message: errorMessage })

      wrapper = createWrapper()
      
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('wrong@email.com')
      await inputs[1].setValue('wrongpass')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(message.error).toHaveBeenCalledWith(errorMessage)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle login error without message property', async () => {
      const { message } = await import('ant-design-vue')
      mockLogin.mockRejectedValueOnce(new Error())

      wrapper = createWrapper()
      
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('test@gmail.com')
      await inputs[1].setValue('12345678')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(message.error).toHaveBeenCalledWith('Login Gagal!')
    })

    it('should call message.destroy before login attempt', async () => {
      const { message } = await import('ant-design-vue')
      mockLogin.mockResolvedValueOnce()

      wrapper = createWrapper()
      
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('test@gmail.com')
      await inputs[1].setValue('12345678')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(message.destroy).toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should show loading state during login', async () => {
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      wrapper = createWrapper()
      
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('test@gmail.com')
      await inputs[1].setValue('12345678')

      const loginPromise = wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.loading).toBe(true)
      
      await loginPromise
      await flushPromises()
      
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should display "Memproses..." when loading', async () => {
      wrapper = createWrapper()
      
      wrapper.vm.loading = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Memproses...')
    })

    it('should display "Login" when not loading', async () => {
      wrapper = createWrapper()
      
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Login')
    })
  })

  describe('Form Data Management', () => {
    it('should update formData when inputs change', async () => {
      wrapper = createWrapper()
      
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('test@example.com')
      await inputs[1].setValue('password123')
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.formData.login).toBe('test@example.com')
      expect(wrapper.vm.formData.password).toBe('password123')
    })

    it('should initialize with empty form data', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.formData.login).toBe('')
      expect(wrapper.vm.formData.password).toBe('')
      expect(wrapper.vm.formData.remember).toBe(false)
    })
  })
})