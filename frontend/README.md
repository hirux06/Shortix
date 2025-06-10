# URL Shortener Frontend

A modern, responsive frontend for a URL Shortener application, built with [Next.js](https://nextjs.org). This project provides a simple interface for shortening URLs, viewing analytics, and managing your links.

---

## 🚀 Features

- **Shorten URLs:** Instantly generate short links for any valid URL.
- **Link Analytics:** View click counts and usage statistics for each short link.
- **Custom Aliases:** Optionally create custom short URLs.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **Fast & Optimized:** Built with Next.js for optimal performance and SEO.

---

## 🛠️ Project Structure

```
frontend/
├── app/
│   ├── page.tsx         # Main page component
│   └── ...              # Other app routes/components
├── components/          # Reusable UI components
├── styles/              # Global and component styles
├── public/              # Static assets
├── package.json
└── README.md
```

---

## 📄 Main Files & Functions

### `app/page.tsx`

- **Purpose:** Main landing page for the URL shortener.
- **Key Functions:**
    - `handleShorten(url: string)`: Sends a request to the backend to shorten the provided URL.
    - `handleCustomAlias(url: string, alias: string)`: Allows users to specify a custom alias for their short URL.
    - `fetchAnalytics(shortUrl: string)`: Retrieves analytics data for a given short URL.
- **UI Elements:**
    - Input field for the original URL.
    - Optional input for custom alias.
    - Button to submit and generate the short URL.
    - Display area for the generated short link and analytics.

### `components/`

- **`UrlForm.tsx`**: Form for entering URLs and custom aliases.
- **`ShortUrlDisplay.tsx`**: Shows the generated short URL and copy functionality.
- **`Analytics.tsx`**: Displays click statistics and charts for each short link.

### `styles/`

- **`globals.css`**: Global styles for consistent look and feel.
- **Component-specific styles** for custom UI elements.

---

## 🧑‍💻 Getting Started

1. **Install dependencies:**

     ```bash
     npm install
     # or
     yarn install
     ```

2. **Run the development server:**

     ```bash
     npm run dev
     # or
     yarn dev
     ```

3. **Open your browser:**

     Visit [https://shortix-five.vercel.app](https://shortix-five.vercel.app) to use the app.

---

## 📦 Build & Deploy

To create an optimized production build:

```bash
npm run build
npm start
```

You can deploy this app easily on [Vercel](https://vercel.com/) or any platform supporting Next.js.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Vercel Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## 📝 License

This project is licensed under the MIT License.

---

> **Made with ❤️ using Next.js and React**
