import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  setupFiles: ["dotenv/config"],
  //setupFilesAfterEnv: ["./src/jest.setup.ts"],
  testMatch: ["**/*.test.ts"],
}
export default config
