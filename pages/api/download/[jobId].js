import crawler from '../../../lib/crawler';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobId } = req.query;
    const job = crawler.getJobStatus(parseInt(jobId));

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'completed') {
      return res.status(400).json({ error: 'Job is not completed yet' });
    }

    const csv = convertToCSV(job.results);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="crawl-${jobId}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function convertToCSV(results) {
  let csv = 'Type,Value\n';

  if (results.links) {
    results.links.forEach(link => {
      csv += `Link,"${link}"\n`;
    });
  }

  if (results.images) {
    results.images.forEach(image => {
      csv += `Image,"${image}"\n`;
    });
  }

  return csv;
}
