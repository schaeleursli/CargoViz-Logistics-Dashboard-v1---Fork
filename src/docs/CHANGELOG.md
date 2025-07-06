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
## [unreleased] – Auth flow hardening
- Switched cargoVizAPI client to use compile-time __API_URL__.
- Added strong typing (`LoginResponse`) and null-checks around login().
- Persisted token & user to localStorage.
- Fixed "Right side of assignment cannot be destructured" error on bad responses.
## [unreleased] – Fix 404 on login
- Parametrised login route via VITE_CARGOVIZ_LOGIN_PATH.
- Added logging of resolved login URL in development mode.
## [unreleased] – Fix missing __LOGIN_PATH__
- Guaranteed compile-time injection of __LOGIN_PATH__ with fallback '/auth/login'.