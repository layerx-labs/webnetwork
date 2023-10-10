import nextJest from "next/jest.js"
 
const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import("jest").Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  coverageProvider: "v8",
  testMatch: [ "**/?(*.)+(spec|test).[jt]s?(x)" ],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
  ],
};

export default createJestConfig(config);