<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1U206EAP6iZ_DL4ImqwWj8JUcHQnomy5k

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Copy `.env.local` or create one with your API keys:
    ```bash
    GEMINI_API_KEY=your_key_here
    ```

3.  **Run the application:**

    ```bash
    npm run dev
    ```

## Development Commands

-   `npm run dev`: Start development server
-   `npm run build`: Build for production
-   `npm run lint`: Run type checking
-   `npm run preview`: Preview production build

## Deployment

This project includes a GitHub Action workflow that automatically checks and builds the project on every push to the `main` branch.

To deploy, simply push your changes:

```bash
git push origin main
```
