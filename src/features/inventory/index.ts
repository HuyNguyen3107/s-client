// Main exports for inventory feature
export * from "./types";
export * from "./constants";
export * from "./services";
export * from "./queries";
export * from "./mutations";
export * from "./hooks";
export * from "./utils";
export * from "./components";
export * from "./pages";
export * from "./routes";

// Default export for convenience
export { default as InventoryPage } from "./pages/inventory.page";
export { default as InventoryList } from "./components/inventory-list.component";
export { default as InventoryStats } from "./components/inventory-stats.component";
