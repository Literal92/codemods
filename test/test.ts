import { describe, expect, it } from "vitest";
import jscodeshift, { FileInfo, type API, Options } from "jscodeshift";
import transform from "../src/index.js";

const buildApi = (parser: string | undefined): API => ({
  j: parser ? jscodeshift.withParser(parser) : jscodeshift,
  jscodeshift: parser ? jscodeshift.withParser(parser) : jscodeshift,
  stats: () => {
    console.error(
      "The stats function was called, which is not supported on purpose",
    );
  },
  report: () => {
    console.error(
      "The report function was called, which is not supported on purpose",
    );
  },
});

describe("update-angular-imports", () => {
  it("should update Angular Material imports to new module paths", () => {
      const source = `
          import { MatButtonModule } from "@angular/material"\;
      `;

      const expectedOutput = `
          import { MatButtonModule } from "@angular/material/button";
      `;

      const fileInfo: FileInfo = { path: "test-file.ts", source };
      const api: API = buildApi(undefined);
      const options: Options = {};

      const output = transform(fileInfo, api, options);

      expect(output.trim()).toBe(expectedOutput.trim());
  });

  it("should handle multiple imports in a single statement", () => {
      const source = `import { MatButtonModule, MatCardModule } from "@angular/material";`;

      const expectedOutput = `import { MatButtonModule } from "@angular/material/button";\r\nimport { MatCardModule } from "@angular/material/card";`;

      const fileInfo: FileInfo = { path: "test-file.ts", source };
      const api: API = buildApi(undefined);
      const options: Options = {};

      const output = transform(fileInfo, api, options);

      expect(output.trim()).toBe(expectedOutput.trim());
  });

  it("should not change imports from other modules", () => {
      const source = `
          import { MatButtonModule } from "@angular/material";
      `;

      const expectedOutput = `
          import { MatButtonModule } from "@angular/material/button";
      `;

      const fileInfo: FileInfo = { path: "test-file.ts", source };
      const api: API = buildApi(undefined);
      const options: Options = {};

      const output = transform(fileInfo, api, options);

      expect(output.trim()).toBe(expectedOutput.trim());
  });
});