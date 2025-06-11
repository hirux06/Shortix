## Task List to be completed: Shortix Project Improvements (v2)

**Project:** Shortix
**Last Updated:** June 11, 2025 (12:30 PM)

This document outlines the immediate tasks to improve the Shortix codebase. It has been updated with clarifications based on your excellent questions. Please complete the tasks in the order listed.

---

### **General Instructions & Best Practices**

Before you begin, please keep these guidelines in mind. They will help ensure the code remains high-quality, consistent, and maintainable.

#### **General Coding Best Practices**

* **Write Clean, Readable Code:** Strive for clarity. Code is read far more often than it is written. Use meaningful names for variables and functions.
* **Keep Functions Small & Focused:** Each function should do one thing and do it well. This makes them easier to understand, test, and reuse.
* **Comment Non-Obvious Logic:** If you write a piece of code that is complex or has a non-obvious purpose, add a brief comment explaining *why* it's needed, not just *what* it does.
* **Commit Frequently:** Make small, logical commits. A commit history that tells a story is an invaluable tool. Write clear and concise commit messages (e.g., `feat: Implement rate limiting for auth routes`, `fix: Correct inefficient user query`).
* **Don't Repeat Yourself (DRY):** If you find yourself writing the same code in multiple places, consider creating a reusable function or component.

#### **Project-Specific Instructions**

* **Follow the Existing Architecture:** Place new files in the appropriate directories (e.g., new utility functions go in `utils`, new components in `components`).
* **Embrace TypeScript:** Use TypeScript's features to your advantage. Define clear types and interfaces. Avoid using `any` unless it is absolutely necessary and justified.
* **Consistent Error Handling:** Use the custom `HttpError` classes we are creating (`NotFoundError`, `BadRequestError`, etc.) for all error handling in the backend. Services should `throw` these errors; controllers should `catch` them.
* **Environment Variables are Key:** **Do not** commit any new hardcoded secrets, keys, or URLs. All configuration must be managed through environment variables.
* **Backend Import Style:** In the backend, please use the `.js` extension for relative imports to maintain consistency with the existing ES module setup (e.g., `import { ... } from './utils/dbConnect.js';`). This is required for `ts-node` with ESM to work correctly.

---

### Task 1: Fix Hardcoded Frontend API URL (High Priority)

**Goal:** Decouple the frontend from hardcoded API endpoints by using environment variables. This is critical for security and switching between development and production environments.

**Sub-tasks:**

1. **Create an environment file for local development:**
    * In the `frontend/` directory, create a new file named `.env.local`.
    * Inside `.env.local`, add the following variable. This will point to your local backend server.

        ```
        NEXT_PUBLIC_API_URL=http://localhost:3000
        ```

    * *Note: For Next.js, environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser. The production URL (`https://shortix.onrender.com`) will be set in the deployment environment, not committed to the repository.*

2. **Update API calls in the frontend:**
    * Go through the following files and replace the hardcoded `"https://shortix.onrender.com"` string with `process.env.NEXT_PUBLIC_API_URL`.
        * `frontend/app/(auth)/login/page.tsx` (for both `axios.get` and `axios.post`)
        * `frontend/app/(auth)/register/page.tsx`
        * `frontend/app/generateLink/page.tsx`
        * `frontend/app/generateQR/page.tsx`
        * `frontend/app/showStats/page.tsx`

3. **Update the short link `href` in the statistics page:**
    * **Clarification:** You correctly noted that the shortened link's `href` should point to the backend URL, since that's where the redirect logic lives. `NEXT_PUBLIC_API_URL` is the correct variable to use for this.
    * In `frontend/app/showStats/page.tsx`, find the `<a>` tag that displays the short URL.
    * Update its `href` attribute from `'https://shortix.onrender.com/...'` to `` `${process.env.NEXT_PUBLIC_API_URL}/${link.shortUrl}` ``.

4. **Delete unused API utility:**
    * The file `frontend/app/lib/loginAPI.ts` is redundant and not used. Please delete it.

---

### Task 2: Refactor Backend Services to Throw Errors (High Priority)

**Goal:** Enforce a consistent error handling pattern where services throw errors and controllers handle the HTTP response.

**Sub-tasks:**

1. **Create Custom Error Classes:**
    * **Guidance:** Your suggestion to use custom errors is excellent. Let's implement that.
    * Create a new file: `backend/src/utils/errors.ts`.
    * Define a base `HttpError` class and specific error classes like this:

        ```typescript
        export class HttpError extends Error {
          constructor(public statusCode: number, message: string) {
            super(message);
          }
        }
        
        export class NotFoundError extends HttpError {
          constructor(message = "Resource not found") {
            super(404, message);
          }
        }
        
        export class BadRequestError extends HttpError {
          constructor(message = "Bad request") {
            super(400, message);
          }
        }
        
        export class UnauthorizedError extends HttpError {
            constructor(message = "Unauthorized") {
                super(401, message);
            }
        }
        ```

2. **Refactor `userServices.ts`:**
    * In `registerUser` and `loginUser`, replace all `res.status(...).json(...)` calls with `throw` statements using the new custom errors.
        * Example: `res.status(400).json(...)` becomes `throw new BadRequestError("User already exists. Kindly login")`.
        * Example: `res.status(404).json(...)` becomes `throw new NotFoundError("User is not found. Kindly register")`.
    * On success, these services should return the relevant data (e.g., the created `user` object or the found `isUserExisting` object). They should **not** call `signIn` or return a token.

3. **Refactor `signIn` function:**
    * **Guidance:** You are right, `signIn` should not interact with the `res` object.
    * Modify `signIn` so it only accepts the user ID, generates the token, and **returns the token string**. Remove the `req` and `res` parameters.

4. **Update `authController.ts`:**
    * Modify the `register` and `login` functions. They will now call the refactored services and get user data back.
    * On success, the controller will then call `signIn` to get the token, set the cookie using `res.cookie(...)`, and send the final success response.
    * The `catch` block should be updated to catch `HttpError` instances and use their `statusCode` and `message` to send the response, with a fallback for unexpected errors.

---

### Task 3: Improve Database Query Efficiency

**Goal:** Use more performant database query methods.

**Sub-tasks:**

1. **Update `backend/src/services/userServices.ts`:**
    * In the `registerUser` function, change `await UserModel.find({ email })` to `await UserModel.findOne({ email })`.
    * Adjust the subsequent logic that checks `isUserExisting.length > 0` to simply check if the `isUserExisting` result is truthy (i.e., not `null`).
2. **Proactive Check (Optional but encouraged):**
    * **Guidance:** Your initiative is great. Please feel free to look through the rest of the backend for other places where `find()` is used to fetch a single, unique document and refactor it to `findOne()`.

---

### Task 4: Clean Up Dead Code

**Goal:** Improve codebase readability by removing commented-out and unused code.

**Sub-tasks:**

1. **Clean `backend/src/models/userModel.ts`:**
    * Delete the large, commented-out code blocks related to the `comparePassword` method, the `toJSON` transform, and the `pre-save` hook for password hashing.

---

### Task 5: Implement Backend Rate Limiting (Medium Priority)

**Goal:** Protect the server from brute-force attacks and resource abuse.

**Sub-tasks:**

1. **Install package:**
    * In the `backend/` directory, run `npm install express-rate-limit`. You will also need `@types/express-rate-limit` for TypeScript support.

2. **Apply Rate Limiters in `backend/src/server.ts`:**
    * **Guidance:** We will use two different strategies as you suggested.
    * Import `rateLimit` from `express-rate-limit`.
    * Create a **strict limiter** for authentication routes:

        ```typescript
        const authLimiter = rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 10, // Limit each IP to 10 login/register requests per window
          message: 'Too many requests from this IP, please try again after 15 minutes',
        });
        app.use('/auth/login', authLimiter);
        app.use('/auth/register', authLimiter);
        ```

    * Create a **general limiter** for all other API routes and apply it before your route definitions:

        ```typescript
        const apiLimiter = rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // Limit each IP to 100 requests per window
        });
        app.use('/create', apiLimiter);
        app.use('/generateQR', apiLimiter);
        // etc.
        ```

---

### Task 6: Secure Information Disclosure

**Goal:** Prevent leaking internal or sensitive data in API responses.

**Sub-tasks:**

1. **Update the `validate` endpoint in `backend/src/controllers/authController.ts`:**
    * **Guidance:** You are right to be cautious about what data is returned.
    * After verifying the token, use the `decoded.id` to fetch the user from the database.
    * When fetching, explicitly exclude the `password` and the `__v` (version key) from the result.

        ```typescript
        const user = await UserModel.findById(decoded.id).select('-password -__v');
        ```

    * If the user is not found, throw a `NotFoundError`.
    * Return the curated `user` object in the response instead of the raw `decoded` token payload.

---

