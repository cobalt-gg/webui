import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Toaster } from "@cobalt/ui";
import * as UI from "@cobalt/ui";
import { categories, registry } from "@cobalt/ui/registry";
import { previews } from "../site/src/previews";

afterEach(cleanup);

describe("registry", () => {
  it("has unique names and slugs", () => {
    expect(new Set(registry.map((d) => d.name)).size).toBe(registry.length);
    expect(new Set(registry.map((d) => d.slug)).size).toBe(registry.length);
  });

  it("covers at least the 74 components of the previous kit", () => {
    expect(registry.length).toBeGreaterThanOrEqual(74);
  });

  it("only uses known categories", () => {
    for (const d of registry) expect(categories).toContain(d.category);
  });

  it("documents a real export for every entry", () => {
    for (const d of registry) expect(UI, d.name).toHaveProperty(d.name);
  });

  it("has a preview for every entry and nothing extra", () => {
    expect(Object.keys(previews).sort()).toEqual(registry.map((d) => d.name).sort());
  });
});

describe("previews", () => {
  for (const d of registry) {
    it(`${d.name} renders without React warnings`, () => {
      const errors = vi.spyOn(console, "error").mockImplementation(() => {});
      const Preview = previews[d.name];
      render(<Toaster><Preview /></Toaster>);
      const messages = errors.mock.calls.map((c) => String(c[0]));
      errors.mockRestore();
      expect(messages.filter((m) => !m.includes("not wrapped in act"))).toEqual([]);
    });
  }
});
