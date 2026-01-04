import { vi } from 'vitest'
import { config } from '@vue/test-utils'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

const AntDesignVueMocks = {
  AForm: { template: '<form><slot /></form>' },
  AFormItem: { template: '<div><slot /></div>' },
  AInput: { template: '<input />', props: ['value', 'placeholder'] },
  AInputPassword: { template: '<input type="password" />', props: ['value', 'placeholder'] },
  ACheckbox: { template: '<input type="checkbox" />', props: ['checked'] },
  AButton: { 
    template: '<button><slot /></button>', 
    props: ['loading', 'disabled', 'type', 'htmlType', 'block'] 
  },
  Tag: { 
    template: '<span><slot /></span>', 
    props: ['color'] 
  },
  Image: { 
    template: '<img />', 
    props: ['src', 'width', 'height', 'fallback', 'preview'] 
  },
  ATable: {
    template: '<div><slot /></div>',
    props: ['columns', 'dataSource', 'loading', 'pagination']
  },
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
    warning: vi.fn(),
  }
}

config.global.stubs = {
  'a-form': AntDesignVueMocks.AForm,
  'a-form-item': AntDesignVueMocks.AFormItem,
  'a-input': AntDesignVueMocks.AInput,
  'a-input-password': AntDesignVueMocks.AInputPassword,
  'a-checkbox': AntDesignVueMocks.ACheckbox,
  'a-button': AntDesignVueMocks.AButton,
  'Tag': AntDesignVueMocks.Tag,
  'Image': AntDesignVueMocks.Image,
  'a-table': AntDesignVueMocks.ATable,
}

config.global.components = {
  Tag: AntDesignVueMocks.Tag,
  Image: AntDesignVueMocks.Image,
}

global.matchMedia = global.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}