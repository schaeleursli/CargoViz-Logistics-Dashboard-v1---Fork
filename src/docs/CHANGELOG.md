# Changelog
## [Unreleased] - feat/fix-api-integration
### Added
- Vite configuration with environment variable support
- Strict TypeScript configuration
- ESLint and Prettier configuration
- Husky pre-commit hooks for linting and type checking
- Playwright tests for basic end-to-end testing
### Changed
- Migrated from REACT_APP_* to VITE_* environment variables
- Refactored API client with better TypeScript typing
- Updated React Query hooks with proper error handling
- Added auth interceptor for consistent 401 handling
- Improved folder structure with @/* path aliases
### Fixed
- Fixed TypeScript errors throughout the codebase
- Ensured consistent API response handling
- Improved error handling in API requests
## [unreleased] – Env handling
- Switched from runtime `import.meta.env.*` reads to compile-time `__API_URL__`
  constant to prevent crashes when envs aren't injected (MagicPatterns fix).