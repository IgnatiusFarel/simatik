import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DashboardView from "@/components/dashboard/DashboardView.vue";
import Antd from "ant-design-vue";

const { mockApiGet } = vi.hoisted(() => ({
  mockApiGet: vi.fn(),
}));

vi.mock("@/services/Api.js", () => ({
  default: {
    get: mockApiGet,
  },
}));

vi.stubEnv("VITE_APP_URL", "http://localhost:8000");

const mockDashboardResponse = {
  data: {
    data: {
      data: [
        {
          id: 1,
          seri: "SN001",
          barang: "Laptop Dell",
          gambar: "uploads/laptop.jpg",
          pengadaan: "2024-01-15",
          pemeliharaan: "2024-06-15",
          harga: 15000000,
          kategori: "Elektronik",
          status: "Baik",
        },
        {
          id: 2,
          seri: "SN002",
          barang: "Printer HP",
          gambar: "storage/printer.jpg",
          pengadaan: "2024-02-20",
          pemeliharaan: null,
          harga: 3000000,
          kategori: "Elektronik",
          status: "Pemeliharaan",
        },
      ],
      total: 2,
      current_page: 1,
      per_page: 10,
    },
  },
};

const mockAssetResponse = {
  data: {
    data: {
      baik: { jumlah: 50, persen: 60 },
      pemeliharaan: { jumlah: 25, persen: 30 },
      rusak: { jumlah: 8, persen: 10 },
    },
  },
};

describe("DashboardView.vue", () => {
  let wrapper;

  const createWrapper = () => {
    return mount(DashboardView, {
      global: {
        plugins: [Antd],
        stubs: {
          AssetCard: true,
          CustomTable: true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe("Rendering", () => {
    it("renders 3 AssetCard components", () => {
      wrapper = createWrapper();

      const cards = wrapper.findAllComponents({ name: "AssetCard" });
      expect(cards).toHaveLength(3);
    });

    it("renders CustomTable component", () => {
      wrapper = createWrapper();

      expect(wrapper.findComponent({ name: "CustomTable" }).exists()).toBe(
        true
      );
    });

   it('renders Recent History header slot', () => {
  wrapper = createWrapper()

  const header = wrapper.find('.table-header')
  expect(header.exists()).toBe(true)
  expect(header.text()).toContain('⏱ Recent History')
});

  });

  describe("Initial State", () => {
    it("initializes cards with default values", () => {
      wrapper = createWrapper();

      expect(wrapper.vm.cards).toHaveLength(3);
      expect(wrapper.vm.cards[0]).toMatchObject({
        title: "Aset Baik",
        total: 0,
        percentage: "0%",
      });
    });

    it("initializes empty table data", () => {
      wrapper = createWrapper();

      expect(wrapper.vm.dataTable).toEqual([]);
      expect(wrapper.vm.totalItems).toBe(0);
    });
  });

  describe("Data Fetching", () => {
    it("fetches dashboard and asset data on mounted", async () => {
      mockApiGet
        .mockResolvedValueOnce(mockDashboardResponse)
        .mockResolvedValueOnce(mockAssetResponse);

      wrapper = createWrapper();
      await flushPromises();

      expect(mockApiGet).toHaveBeenCalledWith("/dashboard", {
        params: {
          page_size: 10,
          page: 1,
        },
      });

      expect(mockApiGet).toHaveBeenCalledWith("dashboard/asset");
    });

    it("updates table data correctly", async () => {
      mockApiGet
        .mockResolvedValueOnce(mockDashboardResponse)
        .mockResolvedValueOnce(mockAssetResponse);

      wrapper = createWrapper();
      await flushPromises();

      expect(wrapper.vm.dataTable).toEqual(
        mockDashboardResponse.data.data.data
      );
      expect(wrapper.vm.totalItems).toBe(2);
      expect(wrapper.vm.currentPage).toBe(1);
    });

    it("updates asset cards correctly", async () => {
      mockApiGet
        .mockResolvedValueOnce(mockDashboardResponse)
        .mockResolvedValueOnce(mockAssetResponse);

      wrapper = createWrapper();
      await flushPromises();

      expect(wrapper.vm.cards[0].total).toBe(50);
      expect(wrapper.vm.cards[0].percentage).toBe("60%");
      expect(wrapper.vm.cards[1].total).toBe(25);
      expect(wrapper.vm.cards[2].total).toBe(8);
    });
  });

  describe("Pagination", () => {
    it("handles page change", async () => {
      mockApiGet.mockResolvedValue(mockDashboardResponse);

      wrapper = createWrapper();
      await flushPromises();

      mockApiGet.mockClear();

      await wrapper.vm.handlePageChange(2);
      await flushPromises();

      expect(mockApiGet).toHaveBeenCalledWith("/dashboard", {
        params: {
          page_size: 10,
          page: 2,
        },
      });
    });

    it("handles page size change", async () => {
      mockApiGet.mockResolvedValue(mockDashboardResponse);

      wrapper = createWrapper();
      await flushPromises();

      mockApiGet.mockClear();

      await wrapper.vm.handlePageSizeChange(20);
      await flushPromises();

      expect(mockApiGet).toHaveBeenCalledWith("/dashboard", {
        params: {
          page_size: 20,
          page: 1,
        },
      });
    });
  });

  describe("Error Handling", () => {
    it("shows API error message when fetch fails", async () => {
      const { message } = await import("ant-design-vue");

      mockApiGet.mockRejectedValueOnce({
        message: "Network Error",
      });

      wrapper = createWrapper();
      await flushPromises();

      expect(message.error).toHaveBeenCalledWith("Network Error");
    });

    it("shows fallback error message if error has no message", async () => {
      const { message } = await import("ant-design-vue");

      mockApiGet.mockRejectedValueOnce({});

      wrapper = createWrapper();
      await flushPromises();

      expect(message.error).toHaveBeenCalledWith("Gagal mengambil data");
    });
  });

  describe("getStatusTagColor()", () => {
    it("returns correct color based on status", () => {
      wrapper = createWrapper();

      expect(wrapper.vm.getStatusTagColor("Baik")).toBe("green");
      expect(wrapper.vm.getStatusTagColor("Pemeliharaan")).toBe("orange");
      expect(wrapper.vm.getStatusTagColor("Rusak")).toBe("red");
      expect(wrapper.vm.getStatusTagColor("Unknown")).toBe("default");
    });
  });
});
