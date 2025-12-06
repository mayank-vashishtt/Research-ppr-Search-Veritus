# Veritus Research Discovery Micro-App

A premium research discovery application powered by the **Veritus Search API**. This app allows users to explore trending academic topics and access the latest scientific papers.

## Features

- **Trending Topics**: Curated list of high-interest research areas (e.g., Generative AI, Climate Change).
- **Live Search**: Real-time integration with Veritus API to fetch the latest papers.
- **Paper Details**: View impact factors, citation counts, and direct PDF links.
- **Premium UI**: Modern dark-mode aesthetic with responsive design.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **API**: Veritus Search API (v1)

## Getting Started

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root:
    ```bash
    VERITUS_API_KEY=your_api_key_here
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/page.tsx`: Home page with Trending Topics grid.
- `src/app/topic/[slug]/page.tsx`: Results page with async job polling.
- `src/app/components/`: Reusable UI components (`TopicCard`, `PaperCard`, `JobPoller`).
- `src/app/api/`: Backend API routes to securely proxy Veritus API requests.
The loading time (typically 5-15 seconds) occurs because the app is performing a Live Deep Search, not just a database lookup.

Here is what happens in the background:

AI Analysis: The system reads your query ("Research regarding...") and semantically matches it against millions of academic papers (it doesn’t just match keywords).
Enrichment: We are requesting Enriched Data (enrich: true). This forces the API to fetch real-time metadata for every result, including:
Citation counts (Influential vs standard)
PDF download links
Journal impact factors
Trade-off: This "Deep Search + Enrichment" process gives you high-quality, actionable results (PDFs you can actually read) but costs a few extra seconds. Only a simple keyword search would be instant, but it would lack this depth.