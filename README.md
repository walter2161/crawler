# Site Crawler Netlify

A web crawler application built with Next.js and deployed on Netlify.

## Features

- Web crawling capabilities
- RESTful API endpoints
- Job status tracking
- File download support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your Netlify environment

3. Deploy to Netlify

## API Endpoints

- `POST /api/crawl` - Start a new crawl job
- `GET /api/status/[jobId]` - Check job status
- `GET /api/download/[jobId]` - Download crawl results

## Development

```bash
npm run dev
```

## License

MIT
