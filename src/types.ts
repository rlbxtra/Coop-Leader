/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CoopStyle = 'rooster' | 'hen' | 'rebel';

export interface Answer {
  id: string;
  text: string;
  style: CoopStyle;
  comicalFeedback: string; // The funny response given immediately when clicked
}

export interface Question {
  id: string;
  scenario: string;
  context: string;
  answers: Answer[];
}

export interface ResultDetails {
  title: string;
  tagline: string;
  description: string;
  fullAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  copingMechanism: string;
  mascotName: string;
  statPercentages: {
    rooster: number;
    hen: number;
    rebel: number;
  };
  badges: string[];
  imagePath: string; // Dynamic path matching our generated images
}

export interface OracleMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
