/**
 * Users Feature Module - Following SOLID Principles
 *
 * This module provides comprehensive user management functionality including:
 * - User CRUD operations (Create, Read, Update, Delete)
 * - Role assignment and management
 * - User status management (Active/Inactive)
 * - Advanced filtering and searching
 * - Pagination and sorting
 * - Permission-based access control
 *
 * Architecture follows SOLID principles:
 * - Single Responsibility: Each component has one clear purpose
 * - Open/Closed: Components are extensible without modification
 * - Liskov Substitution: Interfaces are properly implemented
 * - Interface Segregation: Interfaces are focused and minimal
 * - Dependency Inversion: Components depend on abstractions
 */

// Export all public APIs
export * from "./types";
export * from "./constants";
export * from "./services";
export * from "./queries";
export * from "./mutations";
export * from "./hooks";
export * from "./components";
export * from "./pages";
export * from "./routes";

// Default exports
export { default as UserListPage } from "./pages/UserListPage";
export { default as usersRoutes } from "./routes/users.routes";
