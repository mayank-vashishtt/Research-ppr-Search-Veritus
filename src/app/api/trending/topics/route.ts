import { NextResponse } from 'next/server';

const TRENDING_TOPICS = [
  "Generative AI",
  "Large Language Models",
  "Climate Change Mitigation",
  "CRISPR Gene Editing",
  "Quantum Computing Algorithms",
  "Sustainable Energy Storage",
  "Personalized Medicine",
  "Neuromorphic Computing",
  "Space Exploration Technologies",
  "Cybersecurity in IoT",
  "Blockchain Scalability",
  "Ethical AI"
];

export async function GET() {
  return NextResponse.json({ topics: TRENDING_TOPICS });
}
