import { Router } from 'itty-router';

const router = Router();

interface CrawlRequest {
  url: string;
  maxPages?: number;
}

interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  createdAt: string;
  completedAt?: string;
  results?: unknown;
  error?: string;
}

// POST /api/crawl - Start a new crawl job
router.post('/api/crawl', async (req) => {
  try {
    const { url, maxPages = 10 } = (await req.json()) as CrawlRequest;
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const jobId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Return job info
    const jobStatus: JobStatus = {
      jobId,
      status: 'pending',
      url,
      createdAt: timestamp,
    };

    return new Response(JSON.stringify(jobStatus), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// GET /api/status/:jobId - Check job status
router.get('/api/status/:jobId', (req) => {
  const { jobId } = req.params;
  
  const jobStatus: JobStatus = {
    jobId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(jobStatus), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// GET /api/download/:jobId - Download results
router.get('/api/download/:jobId', (req) => {
  const { jobId } = req.params;

  return new Response(
    JSON.stringify({ message: `Results for job ${jobId}` }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="crawl-${jobId}.json"`,
      },
    }
  );
});

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// 404 handler
router.all('*', () => {
  return new Response('Not Found', { status: 404 });
});

export default router.handle;
