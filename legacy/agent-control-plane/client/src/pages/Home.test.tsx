import React, { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  tenantsQuery: vi.fn(),
  overviewQuery: vi.fn(),
  approvalGateQuery: vi.fn(),
  createApprovalGate: vi.fn(),
  approve: vi.fn(),
  quarantine: vi.fn(),
  invalidate: vi.fn(),
  exportEvidence: vi.fn(),
  utils: undefined as unknown,
}));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: mocks.useAuth }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => mocks.utils,
    pvcu: {
      tenants: { useQuery: mocks.tenantsQuery },
      overview: { useQuery: mocks.overviewQuery },
      approvalGate: { useQuery: mocks.approvalGateQuery },
      createApprovalGate: { useMutation: mocks.createApprovalGate },
      approve: { useMutation: mocks.approve },
      quarantine: { useMutation: mocks.quarantine },
    },
  },
}));

import Home from "./Home";

class FakeEventSource {
  static latest: FakeEventSource | undefined;
  listeners = new Map<string, (event: Event) => void>();
  onerror: (() => void) | null = null;
  closed = false;

  constructor(public url: string) {
    FakeEventSource.latest = this;
  }

  addEventListener(name: string, listener: (event: Event) => void) {
    this.listeners.set(name, listener);
  }

  removeEventListener(name: string) {
    this.listeners.delete(name);
  }

  close() {
    this.closed = true;
  }

  emit(name: string, event: Event = new Event(name)) {
    this.listeners.get(name)?.(event);
  }
}

const tenant = { id: 1, tenantKey: "tenant-a", ownerOpenId: "owner-a", name: "Tenant A", tier: "business", status: "active", config: null, createdAt: new Date(), updatedAt: new Date() };
const validation = { id: 1, validationId: "val-1", tenantKey: "tenant-a", profileId: "default", artifactType: "request", riskClass: "low", status: "approved", spheresPassed: ["L0-shape"], failedSphere: null, failureReason: null, evidenceHash: "a".repeat(64), metadata: null, createdAt: new Date() };
const gate = { id: 1, approvalId: "apr-1", tenantKey: "tenant-a", validationId: "val-1", requiredApprovals: 2, status: "pending", firstApprover: null, firstApprovedAt: null, secondApprover: null, secondApprovedAt: null, decisionHash: null, createdAt: new Date(), updatedAt: new Date() };

mocks.utils = { pvcu: { overview: { invalidate: mocks.invalidate }, exportEvidence: { fetch: mocks.exportEvidence } } };

function mutationResult(mutate = vi.fn()) {
  return { mutate, isPending: false, isError: false, error: null };
}

function setupQueries(overrides: { tenantsError?: boolean; overviewError?: boolean } = {}) {
  mocks.useAuth.mockReturnValue({ user: { openId: "owner-a", role: "admin", name: "Operator" }, loading: false, isAuthenticated: true });
  mocks.tenantsQuery.mockReturnValue({ data: overrides.tenantsError ? [] : [tenant], isLoading: false, isError: Boolean(overrides.tenantsError), error: overrides.tenantsError ? new Error("tenant failure") : null });
  mocks.overviewQuery.mockReturnValue({ data: overrides.overviewError ? undefined : { profiles: [], validations: overrides.tenantsError ? [] : [validation], evidence: [], exceptions: [], metrics: { validationCount: overrides.tenantsError ? 0 : 1, evidenceCount: 0, exceptionCount: 0, approved: 1, blocked: 0, review: 0, approvalRate: 100, evidenceIntegrity: true } }, isLoading: false, isFetching: false, isError: Boolean(overrides.overviewError), error: overrides.overviewError ? new Error("overview failure") : null, refetch: vi.fn() });
  mocks.approvalGateQuery.mockReturnValue({ data: overrides.tenantsError ? undefined : gate, isLoading: false, isError: false, error: null, refetch: vi.fn() });
  mocks.createApprovalGate.mockReturnValue(mutationResult());
  mocks.approve.mockReturnValue(mutationResult());
  mocks.quarantine.mockReturnValue(mutationResult());
  mocks.exportEvidence.mockResolvedValue({ contentDigest: "a".repeat(64), signature: "b".repeat(64) });
}

describe("Home authenticated operational controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("EventSource", FakeEventSource);
    setupQueries();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    FakeEventSource.latest = undefined;
  });

  it("supports keyboard focus and guarded quarantine interaction while consuming SSE", async () => {
    const user = userEvent.setup();
    const quarantineMutate = vi.fn();
    mocks.quarantine.mockReturnValue(mutationResult(quarantineMutate));
    render(<Home />);

    const tenantSelect = screen.getByRole("combobox", { name: "Tenant scope" });
    await user.tab();
    expect(document.activeElement).toBe(tenantSelect);

    await act(async () => FakeEventSource.latest?.emit("ready"));
    await waitFor(() => expect(screen.getByText("CONNECTED")).toBeTruthy());

    await user.click(screen.getAllByText("val-1")[0]);
    const reason = screen.getByRole("textbox", { name: "Motivo de cuarentena" });
    await user.type(reason, "External effect requires review");
    await user.click(screen.getByRole("button", { name: "Quarantine" }));
    expect(quarantineMutate).toHaveBeenCalledWith({ tenantKey: "tenant-a", validationId: "val-1", reason: "External effect requires review" });
  });

  it("keeps the panel mounted and explains controlled query failures", () => {
    setupQueries({ tenantsError: true, overviewError: true });
    render(<Home />);
    expect(screen.getByText("No se pudieron cargar los tenants de este operador.")).toBeTruthy();
    expect(screen.getByText("No se pudo consultar el ledger de este tenant.")).toBeTruthy();
    expect(screen.getAllByText("Universal Control Plane").length).toBeGreaterThan(0);
  });
});


describe("Home authenticated exhaustive controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("EventSource", FakeEventSource);
    setupQueries();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    FakeEventSource.latest = undefined;
  });

  it("walks the primary controls by keyboard from tenant scope to export, approval and quarantine", async () => {
    const user = userEvent.setup();
    const approveMutate = vi.fn();
    const quarantineMutate = vi.fn();
    mocks.approve.mockReturnValue(mutationResult(approveMutate));
    mocks.quarantine.mockReturnValue(mutationResult(quarantineMutate));
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:test") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    render(<Home />);

    const tenantSelect = await screen.findByRole("combobox", { name: "Tenant scope" });
    const validationControl = (await screen.findByText("val-1")).closest("button") as HTMLButtonElement;
    expect(validationControl).toBeTruthy();
    await user.tab();
    expect(document.activeElement).toBe(tenantSelect);
    await user.tab();
    expect(document.activeElement).toBe(validationControl);
    await user.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("button", { name: "Record approval" })).toBeTruthy());

    await user.tab();
    const exportButton = screen.getByRole("button", { name: "Exportar evidencia val-1" });
    expect(document.activeElement).toBe(exportButton);
    await user.keyboard("{Enter}");
    await waitFor(() => expect(mocks.exportEvidence).toHaveBeenCalledWith({ tenantKey: "tenant-a", validationId: "val-1" }));

    const approvalButton = screen.getByRole("button", { name: "Record approval" });
    let approvalFocused = false;
    for (let index = 0; index < 8; index += 1) {
      await user.tab();
      if (document.activeElement === approvalButton) {
        approvalFocused = true;
        break;
      }
    }
    expect(approvalFocused).toBe(true);
    await user.keyboard("{Enter}");
    expect(approveMutate).toHaveBeenCalledWith({ tenantKey: "tenant-a", approvalId: "apr-1" });

    const reason = screen.getByRole("textbox", { name: "Motivo de cuarentena" });
    let reasonFocused = false;
    for (let index = 0; index < 8; index += 1) {
      await user.tab();
      if (document.activeElement === reason) {
        reasonFocused = true;
        break;
      }
    }
    expect(reasonFocused).toBe(true);
    await user.type(reason, "Keyboard governance review");
    const quarantineButton = screen.getByRole("button", { name: "Quarantine" });
    let quarantineFocused = false;
    for (let index = 0; index < 8; index += 1) {
      await user.tab();
      if (document.activeElement === quarantineButton) {
        quarantineFocused = true;
        break;
      }
    }
    expect(quarantineFocused).toBe(true);
    await user.keyboard("{Enter}");
    expect(quarantineMutate).toHaveBeenCalledWith({ tenantKey: "tenant-a", validationId: "val-1", reason: "Keyboard governance review" });
  });

  it("renders controlled mutation errors without unmounting the operational shell", async () => {
    const user = userEvent.setup();
    const approveMutate = vi.fn();
    const quarantineMutate = vi.fn();
    mocks.approve.mockReturnValue({ ...mutationResult(approveMutate), isError: true, error: new Error("Approval persistence failed") });
    mocks.quarantine.mockReturnValue({ ...mutationResult(quarantineMutate), isError: true, error: new Error("Quarantine persistence failed") });
    mocks.exportEvidence.mockRejectedValue(new Error("Export persistence failed"));
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:test") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    render(<Home />);

    await user.click(await screen.findByText("val-1"));
    expect(screen.getAllByText("Approval persistence failed").length).toBeGreaterThan(0);
    const reason = screen.getByRole("textbox", { name: "Motivo de cuarentena" });
    await user.type(reason, "Controlled mutation failure");
    await user.click(screen.getByRole("button", { name: "Quarantine" }));
    expect(screen.getAllByText("Quarantine persistence failed").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Exportar evidencia val-1" }));
    await waitFor(() => expect(screen.getByText("No se pudo generar la exportación firmada para esta validación.")).toBeTruthy());
    expect(screen.getAllByText("Universal Control Plane").length).toBeGreaterThan(0);
  });
});
