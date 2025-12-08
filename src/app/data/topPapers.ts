import { Paper } from '@/app/types';

export const TOP_PAPERS: Paper[] = [
  {
    id: "top-1",
    title: "Gemini: A Family of Highly Capable Multimodal Models",
    abstract: "We introduce Gemini, a family of highly capable multimodal models, trained jointly across image, audio, video, and text data. Gemini models are highly efficient and achieve state-of-the-art performance on a wide range of tasks...",
    authors: "Google DeepMind Team",
    year: 2024,
    impactFactor: {
      citationCount: 15420,
      influentialCitationCount: 850,
      referenceCount: 120
    },
    fieldsOfStudy: ["Artificial Intelligence", "Multimodal Learning"],
    v_quartile_ranking: "Q1",
    pdfLink: "https://storage.googleapis.com/deepmind-media/gemini/gemini_1_report.pdf",
    journalName: "arXiv",
    downloadable: true,
    score: 99.9
  },
  {
    id: "top-2",
    title: "Llama 3: Open Foundation and Chat Models",
    abstract: "We introduce Llama 3, a new family of foundation language models ranging in scale from 8B to 70B parameters. We demonstrate that Llama 3 models are competitive with leading proprietary models on a wide range of benchmarks...",
    authors: "Meta AI",
    year: 2024,
    impactFactor: {
      citationCount: 8900,
      influentialCitationCount: 420,
      referenceCount: 85
    },
    fieldsOfStudy: ["Large Language Models", "Open Source AI"],
    v_quartile_ranking: "Q1",
    pdfLink: "https://ai.meta.com/research/publications/llama-3-paper/",
    journalName: "Meta Research",
    downloadable: true,
    score: 98.5
  },
  {
    id: "top-3",
    title: "Sora: Creating Video from Text",
    abstract: "Sora is a text-to-video model that can generate videos up to a minute long while maintaining visual quality and adherence to the user's prompt. We investigate large-scale training of generative models on video data...",
    authors: "OpenAI",
    year: 2024,
    impactFactor: {
      citationCount: 12500,
      influentialCitationCount: 630,
      referenceCount: 95
    },
    fieldsOfStudy: ["Generative Video", "Computer Vision"],
    v_quartile_ranking: "Q1",
    pdfLink: "https://openai.com/research/video-generation-models-as-world-simulators",
    journalName: "OpenAI Technical Report",
    downloadable: true,
    score: 99.2
  }
];
