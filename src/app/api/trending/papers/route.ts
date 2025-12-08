import { NextResponse } from 'next/server';
import { Paper } from '@/app/types';

const TOP_AI_PAPERS: Paper[] = [
  {
    id: "top-ai-1",
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
    id: "top-ai-2",
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
    id: "top-ai-3",
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

const TOP_ML_PAPERS: Paper[] = [
  {
    id: "top-ml-1",
    title: "Accurate prediction of protein structures and interactions using AlphaFold 3",
    abstract: "We introduce AlphaFold 3, a new model architecture that can predict the structure of complexes including proteins, nucleic acids, small molecules, ions, and modified residues with significantly improved accuracy...",
    authors: "Google DeepMind, Isomorphic Labs",
    year: 2024,
    impactFactor: {
      citationCount: 5200,
      influentialCitationCount: 950,
      referenceCount: 75
    },
    fieldsOfStudy: ["Machine Learning", "Structural Biology"],
    v_quartile_ranking: "Q1",
    pdfLink: "https://www.nature.com/articles/s41586-024-07487-w.pdf",
    journalName: "Nature",
    downloadable: true,
    score: 99.5
  },
  {
    id: "top-ml-2",
    title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
    abstract: "We introduce Mamba, a structured state space model (SSM) architecture that achieves transformer-quality performance while scaling linearly in sequence length. Mamba improves throughput by 5x on long sequences...",
    authors: "Gu, Albert and Dao, Tri",
    year: 2024,
    impactFactor: {
      citationCount: 3100,
      influentialCitationCount: 450,
      referenceCount: 60
    },
    fieldsOfStudy: ["Deep Learning", "Sequence Modeling"],
    v_quartile_ranking: "Q1",
    pdfLink: "https://arxiv.org/pdf/2312.00752.pdf",
    journalName: "arXiv",
    downloadable: true,
    score: 98.0
  },
  {
    id: "top-ml-3",
    title: "YOLOv10: Real-Time End-to-End Object Detection",
    abstract: "YOLOv10 eliminates the need for non-maximum suppression (NMS) during training and inference, achieving state-of-the-art performance and efficiency. It introduces a consistent dual assignment strategy for NMS-free training...",
    authors: "Wang, Ao et al.",
    year: 2024,
    impactFactor: {
      citationCount: 1800,
      influentialCitationCount: 120,
      referenceCount: 45
    },
    fieldsOfStudy: ["Computer Vision", "Object Detection"],
    v_quartile_ranking: "Q1",
    pdfLink: "https://arxiv.org/pdf/2405.14458",
    journalName: "arXiv",
    downloadable: true,
    score: 97.5
  }
];

// Mixed Best-of Selection
const TOP_TRENDING_MIXED: Paper[] = [
  TOP_AI_PAPERS[0], // Gemini
  TOP_ML_PAPERS[0], // AlphaFold 3
  TOP_AI_PAPERS[2]  // Sora
];

export async function GET() {
  return NextResponse.json({
    ai: TOP_AI_PAPERS,
    ml: TOP_ML_PAPERS,
    mixed: TOP_TRENDING_MIXED
  });
}
