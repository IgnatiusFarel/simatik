import { vi } from 'vitest'
import { config } from '@vue/test-utils'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),       
    removeListener: vi.fn(),    
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

vi.mock('ant-design-vue', async () => {
  const actual = await vi.importActual('ant-design-vue')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      destroy: vi.fn(),
    },
    notification: {
      open: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
  }
})

config.global.stubs = {
  'a-form': {
    template: '<form><slot /></form>',
  },
  'a-form-item': {
    template: '<div><slot /></div>',
  },
  'a-input': {
    template: '<input />',
    props: ['value', 'placeholder'],
  },
  'a-input-password': {
    template: '<input type="password" />',
    props: ['value', 'placeholder'],
  },
  'a-checkbox': {
    template: '<input type="checkbox" />',
    props: ['checked'],
  },
  'a-button': {
    template: '<button><slot /></button>',
    props: ['loading', 'disabled', 'type', 'htmlType', 'block'],
  },
  'a-table': {
    template: '<div><slot /></div>',
    props: ['columns', 'dataSource', 'loading', 'pagination'],
  },
}

config.global.components = {
  Tag: {
    template: '<span><slot /></span>',
  },
  Image: {
    template: '<img />',
  },
}
