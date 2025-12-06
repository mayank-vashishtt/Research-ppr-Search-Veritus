import axios, { AxiosInstance } from 'axios';
import { CreateJobOptions, JobResponse, JobStatusResponse, Paper } from '../types';

const API_KEY = process.env.VERITUS_API_KEY;
const BASE_URL = 'https://discover.veritus.ai/api/v1';

if (!API_KEY) {
  console.error('VERITUS_API_KEY is not defined in environment variables.');
}

class VeritusClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createJob(type: 'keywordSearch' | 'querySearch' | 'combinedSearch', options: CreateJobOptions): Promise<string> {
    try {
      const {
        limit,
        fieldsOfStudy,
        minCitationCount,
        openAccessPdf,
        downloadable,
        quartileRanking,
        publicationTypes,
        sort,
        year,
        ...body
      } = options;

      const params = {
        limit,
        fieldsOfStudy,
        minCitationCount,
        openAccessPdf,
        downloadable,
        quartileRanking,
        publicationTypes,
        sort,
        year,
      };

      // Filter out undefined params
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      );

      const response = await this.client.post<JobResponse>(`/job/${type}`, body, {
        params: cleanParams,
      });
      return response.data.jobId;
    } catch (error: any) {
      console.error('Error creating job:', error.response?.data || error.message);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    try {
      const response = await this.client.get<JobStatusResponse>(`/job/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting job status:', error.response?.data || error.message);
      throw error;
    }
  }

  async searchPapers(title: string): Promise<Paper[]> {
    try {
      const response = await this.client.get<Paper[]>('/papers/search', {
        params: { title },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching papers:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPaper(corpusId: string): Promise<Paper> {
    try {
      const response = await this.client.get<Paper>(`/papers/${corpusId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting paper:', error.response?.data || error.message);
      throw error;
    }
  }

  async getCredits() {
     try {
      const response = await this.client.get('/user/getCredits');
      return response.data;
    } catch (error: any) {
      console.error('Error getting credits:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const veritusClient = new VeritusClient();
