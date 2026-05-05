import crawler from '../../lib/crawler';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const jobId = await crawler.crawl(url);

    res.status(200).json({
      jobId,
      message: 'Crawl job started',
      statusUrl: `/api/status/${jobId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
