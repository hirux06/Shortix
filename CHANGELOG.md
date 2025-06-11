# Changelog

## [1.0.0] - 2025-06-11

### Added
- Created `.env.local` file with `NEXT_PUBLIC_API_URL` environment variable for local development
- Added custom error classes in `backend/src/utils/errors.ts` for consistent error handling
- Implemented rate limiting for authentication and API routes

### Changed
- Replaced hardcoded API URLs with environment variables in all frontend files:
  - `frontend/app/(auth)/login/page.tsx`
  - `frontend/app/(auth)/register/page.tsx`
  - `frontend/app/generateLink/page.tsx`
  - `frontend/app/generateQR/page.tsx`
  - `frontend/app/showStats/page.tsx`
- Refactored backend services to throw errors instead of sending HTTP responses:
  - Updated `userServices.ts` to throw custom errors
  - Updated `authController.ts` to handle these errors
  - Updated `authMiddleware.ts` to use custom errors
- Improved database query efficiency:
  - Changed `UserModel.find({ email })` to `UserModel.findOne({ email })` in `userServices.ts`
- Updated the `validate` endpoint to exclude password and version key from user data
- Updated the `signIn` function to only generate and return tokens

### Removed
- Deleted unused API utility: `frontend/app/lib/loginAPI.ts`
- Removed commented-out code blocks from `backend/src/models/userModel.ts` 