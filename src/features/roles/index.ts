// Main exports for roles feature following Single Responsibility Principle
export * from "./types";
export * from "./services";
export * from "./queries";
export * from "./mutations";
export * from "./components";
export * from "./pages";
export * from "./routes";
export * from "./constants";
export * from "./hooks";
export * from "./utils";

// Default export for convenience
export { default as RolesRoutes } from "./routes/roles.routes";
export { default as RolesPage } from "./pages/roles.page";
