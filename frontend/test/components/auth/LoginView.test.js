import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "@/components/auth/LoginView.vue";

// 1. Move all mock functions into a hoisted block
const mocks = vi.hoisted(() => {
  return {
    push: vi.fn(),
    login: vi.fn(),
    messageSuccess: vi.fn(),
    messageError: vi.fn(),
    notificationOpen: vi.fn(),
  };
});

// 2. Reference the hoisted object in your mocks
vi.mock("@/router/index.js", () => ({
  default: {
    push: mocks.push,
  },
}));

vi.mock("@/stores/Auth.js", () => ({
  useAuthStore: () => ({
    login: mocks.login,
  }),
}));

vi.mock("ant-design-vue", async () => {
  const actual = await vi.importActual("ant-design-vue");
  return {
    ...actual,
    message: {
      success: mocks.messageSuccess,
      error: mocks.messageError,
      destroy: vi.fn(),
    },
    notification: {
      open: mocks.notificationOpen,
    },
  };
});

describe("Login.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountLogin = () =>
    mount(Login, {
      global: {
        stubs: {
          "a-form": { template: `<form @submit.prevent="$emit('finish')"><slot /></form>` },
          "a-form-item": { template: `<div><slot /></div>` },
          "a-input": { template: `<input @input="$emit('update:value', $event.target.value)" />` },
          "a-input-password": { template: `<input type="password" @input="$emit('update:value', $event.target.value)" />` },
          "a-checkbox": { template: `<input type="checkbox" @change="$emit('update:checked', $event.target.checked)" />` },
          "a-button": { template: `<button type="submit"><slot /></button>` },
        },
      },
    });

  it("submit login success and redirect", async () => {
    mocks.login.mockResolvedValueOnce({});

    const wrapper = mountLogin();
    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("superadmin@gmail.com");
    await inputs[1].setValue("12345678");

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(mocks.login).toHaveBeenCalled();
    expect(mocks.messageSuccess).toHaveBeenCalledWith("Login Berhasil!");
    expect(mocks.push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows trial notification on mounted", () => {
    mountLogin();
    expect(mocks.notificationOpen).toHaveBeenCalled();
  });
});