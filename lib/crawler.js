const axios = require('axios');
const cheerio = require('cheerio');

class WebCrawler {
  constructor() {
    this.jobs = new Map();
    this.jobId = 0;
  }

  async crawl(url, options = {}) {
    const jobId = ++this.jobId;
    const job = {
      id: jobId,
      url,
      status: 'running',
      startTime: new Date(),
      results: [],
      error: null
    };

    this.jobs.set(jobId, job);

    try {
      const response = await axios.get(url, {
        timeout: options.timeout || 5000
      });

      const $ = cheerio.load(response.data);
      const links = [];
      const images = [];

      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href) links.push(href);
      });

      $('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src) images.push(src);
      });

      job.results = { links, images };
      job.status = 'completed';
      job.endTime = new Date();
    } catch (error) {
      job.status = 'error';
      job.error = error.message;
      job.endTime = new Date();
    }

    return jobId;
  }

  getJobStatus(jobId) {
    return this.jobs.get(jobId) || null;
  }

  getAllJobs() {
    return Array.from(this.jobs.values());
  }
}

module.exports = new WebCrawler();
