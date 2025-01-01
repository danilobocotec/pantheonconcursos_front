import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { buildApiUrl } from '@/lib/api';
import { 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Target, 
  BarChart3,
  CheckCircle,
  BookmarkPlus,
  AlertTriangle,
  Scissors,
  Plus,
  Minus,
  Search,
  Download,
  Play
} from 'lucide-react';
import { Card, Button, media } from '../styles/GlobalStyles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface Question {
  id: string;
  type: 'multiple' | 'true-false';
  subject: string;
  discipline: string;
  institution: string;
  year: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  answered: boolean;
}

interface DiscursiveQuestion {
  id: string;
  year: number;
  discipline: string;
  subject: string;
  institution: string;
  exam: string;
  question: string;
  referenceAnswer: string;
  answered: boolean;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percentage: number;
}

type EvolutionPoint = {
  label: string;
  acertos: number;
  erros: number;
  total: number;
};

type PerformanceSummary = {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  evolution: EvolutionPoint[];
};

type UnknownRecord = Record<string, unknown>;

const TOKEN_KEY = 'pantheon:token';
const QUESTIONS_URL = buildApiUrl('/questoes');
const QUESTION_FILTERS_URL = buildApiUrl('/questoes/filtros');
const PERFORMANCE_URL = buildApiUrl('/meu-desempenho');
const PERFORMANCE_SUMMARY_URL = buildApiUrl('/meu-desempenho/resumo');

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const getString = (record: UnknownRecord, key: string) => {
  const value = record[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
};

const getFirstString = (record: UnknownRecord, keys: string[], fallback = '') => {
  for (const key of keys) {
    const value = getString(record, key);
    if (value) return value;
  }
  return fallback;
};

const toRecord = (value: unknown): UnknownRecord | null =>
  isRecord(value) ? value : null;

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const normalizeQuestionText = (value: string) => {
  if (!value) return '';
  const withBreaks = value.replace(/<br\s*\/?>/gi, '\n');
  const withoutTags = withBreaks.replace(/<\/?[^>]+>/g, '');
  return withoutTags.replace(/\r\n/g, '\n').trim();
};

const normalizeFilterValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const pad2 = (value: number) => String(value).padStart(2, '0');

const formatDateLabel = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return `${pad2(parsed.getDate())}/${pad2(parsed.getMonth() + 1)}`;
};

const formatDateISO = (value: Date) =>
  `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;

const normalizeEvolutionSeries = (payload: UnknownRecord): EvolutionPoint[] => {
  const rawSeries =
    payload['evolucao'] ??
    payload['series'] ??
    payload['itens'] ??
    payload['dados'];
  if (!Array.isArray(rawSeries)) return [];

  return rawSeries.map((entry) => {
    const record = isRecord(entry) ? entry : {};
    const labelSource = getFirstString(record, ['data', 'dia', 'date', 'data_gravacao'], '');
    const correct = toNumber(record['acertos']) ??
      toNumber(record['questoes_corretas']) ??
      toNumber(record['corretas']) ??
      0;
    const incorrect = toNumber(record['erros']) ??
      toNumber(record['questoes_erradas']) ??
      toNumber(record['erradas']) ??
      0;
    const total = toNumber(record['total']) ??
      toNumber(record['total_questoes']) ??
      correct + incorrect;

    return {
      label: formatDateLabel(labelSource),
      acertos: correct,
      erros: incorrect,
      total
    };
  });
};

const normalizePerformanceSummary = (payload: unknown): PerformanceSummary => {
  const fallback: PerformanceSummary = {
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    accuracyPercentage: 0,
    evolution: []
  };
  if (!isRecord(payload)) return fallback;

  const totalQuestions =
    toNumber(payload['total_questoes']) ??
    toNumber(payload['totalQuestoes']) ??
    toNumber(payload['total']) ??
    0;
  const correctAnswers =
    toNumber(payload['questoes_corretas']) ??
    toNumber(payload['questoesCorretas']) ??
    toNumber(payload['corretas']) ??
    0;
  const incorrectAnswers =
    toNumber(payload['questoes_erradas']) ??
    toNumber(payload['questoesErradas']) ??
    toNumber(payload['erradas']) ??
    0;
  const accuracy =
    toNumber(payload['percentual_acertos']) ??
    toNumber(payload['percentualAcertos']) ??
    (totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0);

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    accuracyPercentage: accuracy,
    evolution: normalizeEvolutionSeries(payload)
  };
};

const indexToLetter = (index: number) => String.fromCharCode(97 + index);

const normalizeAnswerKey = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value >= 1 && value <= 5) return indexToLetter(value - 1);
    return '';
  }
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  if (['a', 'b', 'c', 'd', 'e'].includes(lower)) return lower;
  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 5) {
    return indexToLetter(numeric - 1);
  }
  const match = lower.match(/[a-e]/);
  return match ? match[0] : '';
};

const extractQuestionOptions = (record: UnknownRecord): string[] => {
  const alternativeKeys = [
    'alternativa_a',
    'alternativa_b',
    'alternativa_c',
    'alternativa_d',
    'alternativa_e',
    'alternativaA',
    'alternativaB',
    'alternativaC',
    'alternativaD',
    'alternativaE'
  ];
  const alternativeValues = alternativeKeys
    .map((key) => normalizeQuestionText(getString(record, key)))
    .filter((value) => value);
  if (alternativeValues.length) return alternativeValues;

  const raw =
    record['alternativas'] ??
    record['opcoes'] ??
    record['opcoes_texto'] ??
    record['options'] ??
    record['alternatives'] ??
    record['respostas'];
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (typeof item === 'string') return normalizeQuestionText(item);
      if (isRecord(item)) {
        return normalizeQuestionText(
          getFirstString(
            item,
            ['texto', 'descricao', 'enunciado', 'conteudo', 'value', 'titulo'],
            ''
          )
        );
      }
      return normalizeQuestionText(String(item ?? ''));
    });
  }
  if (isRecord(raw)) {
    return Object.values(raw).map((value) => {
      if (typeof value === 'string') return normalizeQuestionText(value);
      if (isRecord(value)) {
        return normalizeQuestionText(
          getFirstString(
            value,
            ['texto', 'descricao', 'enunciado', 'conteudo', 'value', 'titulo'],
            ''
          )
        );
      }
      return normalizeQuestionText(String(value ?? ''));
    });
  }
  return [];
};

const normalizeDifficulty = (value: string) => {
  const normalized = normalizeFilterValue(value);
  if (normalized.includes('facil') || normalized.includes('easy')) return 'easy';
  if (normalized.includes('dificil') || normalized.includes('hard')) return 'hard';
  if (normalized.includes('medio') || normalized.includes('medium')) return 'medium';
  return 'medium';
};

const getDifficultyLabel = (value: Question['difficulty']) => {
  if (value === 'easy') return 'F├ícil';
  if (value === 'hard') return 'Dif├¡cil';
  return 'M├®dio';
};

const normalizeQuestionRecord = (item: unknown, index: number): Question => {
  const record: UnknownRecord = isRecord(item) ? item : {};
  const inputs = toRecord(record['inputs']) ?? {};
  const numeroAlternativaCorreta =
    toNumber(record['numero_alternativa_correta']) ??
    toNumber(record['numeroAlternativaCorreta']) ??
    toNumber(inputs['numeroAlternativaCorreta']);

  const enunciadoRaw = getFirstString(record, [
    'enunciado',
    'enunciado_questao',
    'texto',
    'pergunta',
    'descricao',
    'questao',
    'questao_texto',
    'html_completo',
    'htmlCompleto'
  ]);

  const options = extractQuestionOptions(record).filter((option) => option);
  const answerFromNumber =
    numeroAlternativaCorreta && numeroAlternativaCorreta > 0
      ? indexToLetter(numeroAlternativaCorreta - 1)
      : '';
  const answerFromText = normalizeAnswerKey(
    getFirstString(record, [
      'resposta_correta',
      'respostaCorreta',
      'gabarito',
      'alternativa_correta',
      'alternativaCorreta',
      'numero_alternativa_correta',
      'numeroAlternativaCorreta'
    ])
  );
  const correctAnswer = answerFromNumber || answerFromText;

  const disciplina = getFirstString(record, [
    'area_conhecimento',
    'areaConhecimento',
    'disciplina'
  ]);
  const assunto = getFirstString(record, ['assunto', 'tema', 'topico', 'cargo']);
  const instituicao = getFirstString(record, ['orgao', 'instituicao']);
  const concurso = getFirstString(record, ['concurso', 'ano']);
  const difficultyValue = normalizeDifficulty(
    getFirstString(record, ['dificuldade', 'difficulty'], 'medium')
  );
  const gabarito = normalizeQuestionText(getString(record, 'gabarito'));
  const comentario = normalizeQuestionText(getString(record, 'comentario'));
  const resolucao = normalizeQuestionText(
    getFirstString(record, ['resolucao_banca', 'resolucaoBanca'])
  );
  const explanation = [gabarito, comentario, resolucao].filter(Boolean).join('\n\n');
  const yearNumber = Number.parseInt(concurso, 10);

  return {
    id: getFirstString(
      record,
      ['id', 'uuid', 'id_questao', 'idQuestao'],
      String(index)
    ),
    type: 'multiple',
    subject: assunto || '-',
    discipline: disciplina || '-',
    institution: instituicao || '-',
    year: Number.isNaN(yearNumber) ? 0 : yearNumber,
    difficulty: difficultyValue as Question['difficulty'],
    question: normalizeQuestionText(enunciadoRaw) || 'Enunciado nao informado.',
    options: options.length ? options : undefined,
    correctAnswer,
    explanation: explanation || 'Sem gabarito informado.',
    answered: false
  };
};

const normalizeQuestionCollection = (payload: unknown): Question[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map((item, index) => normalizeQuestionRecord(item, index));
  }
  if (!isRecord(payload)) return [];

  const itemsCandidate = payload['items'];
  if (Array.isArray(itemsCandidate)) {
    return itemsCandidate.map((item, index) => normalizeQuestionRecord(item, index));
  }

  const dataCandidate = payload['data'];
  if (Array.isArray(dataCandidate)) {
    return dataCandidate.map((item, index) => normalizeQuestionRecord(item, index));
  }

  return [];
};

const QuestionsContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  ${media.mobile} {
    padding: 16px;
    padding-top: 60px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;

    ${media.mobile} {
      font-size: 24px;
    }
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 16px;

    ${media.mobile} {
      font-size: 14px;
    }
  }

  ${media.mobile} {
    margin-bottom: 24px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${media.mobile} {
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 16px 24px;
  border: none;
  background: ${props => props.active ? props.theme.colors.accent : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: ${props => props.active ? 'none' : `1px solid ${props.theme.colors.border}`};
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    color: ${props => props.active ? 'white' : props.theme.colors.accentSecondary};
  }

  ${media.mobile} {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};

  ${media.mobile} {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;

  ${media.mobile} {
    min-width: unset;
  }

  label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
  }

  select {
    padding: 8px 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${props => props.theme.colors.accentSecondary};
    }

    &:focus {
      border-color: ${props => props.theme.colors.accentSecondary};
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const FontControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;

  ${media.mobile} {
    min-width: unset;
  }

  label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
  }

  .font-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    padding: 4px;
    justify-content: center;
    
    .font-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: ${props => props.theme.colors.text};
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: ${props => props.theme.colors.accent}15;
        color: ${props => props.theme.colors.accent};
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .font-size {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};
      min-width: 28px;
      text-align: center;
    }
  }
`;

const QuestionCounter = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: 24px;
  padding-left: 4px;

  ${media.mobile} {
    font-size: 13px;
    padding-left: 0;
    margin-bottom: 16px;
  }
`;

const QuestionItem = styled(Card)<{ answered?: boolean; correct?: boolean; fontSize?: number }>`
  margin-bottom: 24px;
  ${props => props.answered && `
    border-left: 4px solid ${props.correct ? props.theme.colors.success : props.theme.colors.error};
  `}

  ${media.mobile} {
    margin-bottom: 16px;
    padding: 16px;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;

  ${media.mobile} {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .question-info {
    flex: 1;
    
    .meta {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;

      ${media.mobile} {
        gap: 6px;
      }
      
      .tag {
        background: ${props => props.theme.colors.surface};
        color: ${props => props.theme.colors.textSecondary};
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        ${media.mobile} {
          font-size: 10px;
          padding: 3px 6px;
        }
      }
    }
  }
`;

const QuestionText = styled.div<{ fontSize?: number }>`
  font-size: ${props => props.fontSize || 16}px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
  margin-bottom: 20px;

  ${media.mobile} {
    font-size: ${props => Math.max((props.fontSize || 16) - 2, 14)}px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  strong {
    font-weight: 600;
  }
`;

const OptionsContainer = styled.div`
  margin-bottom: 20px;

  ${media.mobile} {
    margin-bottom: 16px;
  }
`;

const Option = styled.div<{ 
  selected?: boolean; 
  correct?: boolean; 
  incorrect?: boolean; 
  striked?: boolean;
  fontSize?: number;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  opacity: ${props => props.striked ? 0.4 : 1};
  text-decoration: ${props => props.striked ? 'line-through' : 'none'};
  font-size: ${props => props.fontSize || 16}px;

  ${media.mobile} {
    gap: 8px;
    padding: 10px;
    font-size: ${props => Math.max((props.fontSize || 16) - 2, 14)}px;
    margin-bottom: 6px;
  }

  background: ${props => {
    if (props.correct) return `${props.theme.colors.success}15`;
    if (props.incorrect) return '#db302615';
    if (props.selected) return `${props.theme.colors.accent}15`;
    return 'transparent';
  }};

  border-color: ${props => {
    if (props.correct) return props.theme.colors.success;
    if (props.incorrect) return '#db3026';
    if (props.selected) return props.theme.colors.accent;
    return props.theme.colors.border;
  }};

  &:hover {
    border-color: ${props => props.theme.colors.accentSecondary};
    background: ${props => `${props.theme.colors.accentSecondary}05`};
  }

  .option-letter {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => props.theme.colors.surface};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;

    ${media.mobile} {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }
  }

  .option-text {
    flex: 1;
    line-height: 1.5;
  }

  .strike-btn {
    background: ${props => props.theme.colors.accent};
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px;
    cursor: pointer;
    transition: opacity 0.2s ease;
    flex-shrink: 0;

    ${media.mobile} {
      padding: 6px;
      margin-left: auto;
      opacity: 1;
      position: static;
    }

    @media (hover: hover) {
      position: absolute;
      top: 4px;
      right: 4px;
      opacity: 0;
    }

    @media (hover: none) {
      position: static;
      opacity: 1;
    }
  }

  &:hover .strike-btn {
    opacity: 1;
  }
`;

const AnswerButton = styled(Button)`
  margin: 20px 0;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;

  ${media.mobile} {
    width: 100%;
    margin: 16px 0;
    padding: 12px 20px;
    font-size: 14px;
  }
`;

const QuestionTabs = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 16px;

  ${media.mobile} {
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 16px;
    padding-top: 12px;
  }
`;

const QuestionTab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.surface};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  ${media.mobile} {
    padding: 8px 10px;
    font-size: 11px;
    gap: 3px;
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  &:hover {
    background: ${props => props.active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    border-color: ${props => props.theme.colors.accentSecondary};
    color: ${props => props.active ? 'white' : props.theme.colors.accentSecondary};
  }
`;

const TabContent = styled.div<{ active: boolean; fontSize?: number }>`
  display: ${props => props.active ? 'block' : 'none'};
  margin-top: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  line-height: 1.6;
  font-size: ${props => props.fontSize || 16}px;

  ${media.mobile} {
    padding: 12px;
    font-size: ${props => Math.max((props.fontSize || 16) - 2, 14)}px;
    margin-top: 12px;
  }
`;

const DiscursiveAnswer = styled.textarea<{ fontSize?: number }>`
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-family: inherit;
  font-size: ${props => props.fontSize || 14}px;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  ${media.mobile} {
    min-height: 120px;
    padding: 10px;
    font-size: ${props => Math.max((props.fontSize || 14) - 1, 13)}px;
  }

  &:hover {
    border-color: ${props => props.theme.colors.accentSecondary};
  }

  &:focus {
    border-color: ${props => props.theme.colors.accentSecondary};
    outline: none;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  ${media.mobile} {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s ease;

    ${media.mobile} {
      padding: 10px 12px;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
    }

    &:hover {
      border-color: ${props => props.theme.colors.accentSecondary};
    }

    &:focus {
      border-color: ${props => props.theme.colors.accentSecondary};
      outline: none;
    }
  }
`;

const ExamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.mobile} {
    gap: 12px;
  }
`;

const ExamCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  transition: all 0.2s ease;

  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.shadow};
    border-color: ${props => props.theme.colors.accentSecondary};
  }

  .exam-info {
    flex: 1;
    
    h3 {
      color: ${props => props.theme.colors.accent};
      margin-bottom: 4px;
      font-size: 18px;

      ${media.mobile} {
        font-size: 16px;
      }
    }
    
    .exam-meta {
      color: ${props => props.theme.colors.textSecondary};
      font-size: 14px;

      ${media.mobile} {
        font-size: 13px;
      }
    }
  }

  .exam-actions {
    display: flex;
    gap: 12px;
    align-items: center;

    ${media.mobile} {
      flex-direction: column;
      gap: 8px;
      align-items: stretch;
    }
  }
`;

const DownloadGroup = styled.div`
  display: flex;
  gap: 8px;

  ${media.mobile} {
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
  }
  
  .download-btn {
    padding: 8px 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;

    ${media.mobile} {
      padding: 6px 8px;
      font-size: 10px;
      flex: 1;
      justify-content: center;
      min-width: 0;
    }
  }
`;

const SimulationFilters = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};

  ${media.mobile} {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  ${media.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const StatCard = styled(Card)`
  text-align: center;

  ${media.mobile} {
    padding: 12px 8px;
  }
  
  .stat-number {
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.theme.colors.accent};
    margin-bottom: 8px;

    ${media.mobile} {
      font-size: 20px;
      margin-bottom: 4px;
    }
  }
  
  .stat-label {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 14px;

    ${media.mobile} {
      font-size: 10px;
      line-height: 1.2;
    }
  }
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const ChartCard = styled(Card)`
  height: 350px;
  display: flex;
  flex-direction: column;

  ${media.mobile} {
    height: 250px;
    padding: 12px;
  }
  
  h3 {
    margin-bottom: 16px;
    color: ${props => props.theme.colors.accent};
    font-size: 18px;
    font-weight: 600;

    ${media.mobile} {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }
  
  .chart-container {
    flex: 1;
    width: 100%;
    min-height: 280px;

    ${media.mobile} {
      min-height: 180px;
    }
  }
`;

const NotebookModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalContent = styled(Card)`
  max-width: 400px;
  width: 100%;

  ${media.mobile} {
    width: 100%;
    max-width: 320px;
    margin: 0;
  }
  
  h3 {
    margin-bottom: 16px;
    color: ${props => props.theme.colors.accent};

    ${media.mobile} {
      font-size: 16px;
    }
  }
  
  input {
    width: 100%;
    margin-bottom: 16px;
    padding: 10px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    box-sizing: border-box;

    ${media.mobile} {
      font-size: 14px;
    }
  }
  
  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;

    ${media.mobile} {
      flex-direction: column;
      gap: 8px;
    }
  }
`;

const SistemaQuestoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('objective');
  const [activeQuestionTab, setActiveQuestionTab] = useState('explanation');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({
    discipline: '',
    subject: '',
    institution: '',
    year: '',
    difficulty: '',
    status: ''
  });
  const [simulationFilters, setSimulationFilters] = useState<{ [key: string]: string }>({
    discipline: '',
    subject: ''
  });
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showNotebookModal, setShowNotebookModal] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [strikedOptions, setStrikedOptions] = useState<{ [key: string]: number[] }>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: string]: boolean }>({});
  const [notebooks, setNotebooks] = useState<string[]>(['Caderno Geral']);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [hasLoadedQuestions, setHasLoadedQuestions] = useState(false);
  const [performancePeriod, setPerformancePeriod] = useState('all');
  const [performanceView, setPerformanceView] = useState<'bar' | 'line'>('bar');
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary>({
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    accuracyPercentage: 0,
    evolution: []
  });
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [performanceError, setPerformanceError] = useState<string | null>(null);

  const isSubscriber = true;

  const minFontSize = 12;
  const maxFontSize = 24;

  const increaseFontSize = () => {
    if (fontSize < maxFontSize) {
      setFontSize(prev => prev + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > minFontSize) {
      setFontSize(prev => prev - 2);
    }
  };

  const loadQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError(null);
    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(QUESTIONS_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar questoes (${response.status})`);
      }
      const payload = await response.json();
      setQuestions(normalizeQuestionCollection(payload));
      setHasLoadedQuestions(true);
    } catch (requestError) {
      setQuestionsError(
        requestError instanceof Error
          ? requestError.message
          : 'Erro ao carregar questoes.'
      );
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  const loadPerformanceSummary = useCallback(async (period: string) => {
    setPerformanceLoading(true);
    setPerformanceError(null);
    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (!token) {
        throw new Error('Token nao encontrado. Faca login para ver desempenho.');
      }

      const endDate = new Date();
      let startDate = new Date();
      switch (period) {
        case 'today':
          startDate = new Date(endDate);
          break;
        case '7days':
          startDate.setDate(endDate.getDate() - 6);
          break;
        case '15days':
          startDate.setDate(endDate.getDate() - 14);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 29);
          break;
        case 'all':
        default:
          startDate = new Date(1970, 0, 1);
          break;
      }

      const params = new URLSearchParams({
        data_inicio: formatDateISO(startDate),
        data_fim: formatDateISO(endDate)
      });
      const response = await fetch(`${PERFORMANCE_SUMMARY_URL}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Falha ao carregar desempenho (${response.status})`);
      }
      const payload = await response.json();
      setPerformanceSummary(normalizePerformanceSummary(payload));
    } catch (requestError) {
      setPerformanceError(
        requestError instanceof Error
          ? requestError.message
          : 'Erro ao carregar desempenho.'
      );
      setPerformanceSummary({
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        accuracyPercentage: 0,
        evolution: []
      });
    } finally {
      setPerformanceLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'objective') return;
    if (hasLoadedQuestions || questionsLoading) return;
    void loadQuestions();
  }, [activeTab, hasLoadedQuestions, loadQuestions, questionsLoading]);

  useEffect(() => {
    if (activeTab !== 'performance') return;
    void loadPerformanceSummary(performancePeriod);
  }, [activeTab, loadPerformanceSummary, performancePeriod]);

  const subjectsByDiscipline: { [key: string]: string[] } = {
    'civil': ['LINDB', 'Domic├¡lio'],
    'constitucional': ['Poder Legislativo', 'Controle de Constitucionalidade'],
    'penal': ['Teoria Geral do Delito', 'Pris├úo Preventiva']
  };

  const mockDiscursiveQuestions: DiscursiveQuestion[] = [
    {
      id: '1',
      year: 2023,
      discipline: 'Direito Civil',
      subject: 'Responsabilidade Civil',
      institution: 'OAB',
      exam: 'XXXVII Exame de Ordem',
      question: 'Discorra sobre os elementos da responsabilidade civil e suas modalidades.',
      referenceAnswer: 'A responsabilidade civil possui tr├¬s elementos essenciais: conduta (a├º├úo ou omiss├úo), dano e nexo causal...',
      answered: false
    }
  ];

  const mockExams = [
    { id: '1', name: 'FGV OAB 44┬║ Exame', year: 2025 },
    { id: '2', name: 'FGV OAB 43┬║ Exame', year: 2025 },
    { id: '3', name: 'FGV OAB 42┬║ Exame', year: 2024 },
    { id: '4', name: 'FGV OAB 41┬║ Exame', year: 2024 },
    { id: '5', name: 'FGV OAB 40┬║ Exame', year: 2024 },
    { id: '6', name: 'FGV OAB XXXIX Exame', year: 2023 },
    { id: '7', name: 'FGV OAB XXXVIII Exame', year: 2023 },
    { id: '8', name: 'FGV OAB XXXVII Exame', year: 2023 },
    { id: '9', name: 'FGV OAB XXXVI Exame', year: 2022 },
    { id: '10', name: 'FGV OAB XXXV Exame', year: 2022 },
    { id: '11', name: 'FGV OAB XXXIV Exame', year: 2022 },
    { id: '12', name: 'FGV OAB XXXIII Exame', year: 2021 },
    { id: '13', name: 'FGV OAB XXXII Exame', year: 2021 },
    { id: '14', name: 'FGV OAB XXXI Exame', year: 2021 }
  ];

  const tabs = [
    { id: 'objective', label: 'Questões Objetivas', icon: HelpCircle },
    { id: 'discursive', label: 'Questões Discursivas', icon: FileText },
    { id: 'exams', label: 'Provas Comentadas', icon: BookOpen },
    { id: 'simulations', label: 'Simulados', icon: Target },
    { id: 'performance', label: 'Meu Desempenho', icon: BarChart3 }
  ];

  const questionTabs = [
    { id: 'explanation', label: 'Gabarito Comentado', icon: CheckCircle },
    { id: 'notebook', label: 'Caderno', icon: BookmarkPlus },
    { id: 'report', label: 'Notificar Erro', icon: AlertTriangle }
  ];
  const pieData = [
    { 
      name: 'Questoes Corretas', 
      value: performanceSummary.correctAnswers, 
      percentage: performanceSummary.totalQuestions
        ? Math.round((performanceSummary.correctAnswers / performanceSummary.totalQuestions) * 100)
        : 0,
      color: '#22c55e' 
    },
    { 
      name: 'Questoes Incorretas', 
      value: performanceSummary.incorrectAnswers, 
      percentage: performanceSummary.totalQuestions
        ? Math.round((performanceSummary.incorrectAnswers / performanceSummary.totalQuestions) * 100)
        : 0,
      color: '#db3026'
    }
  ];

  // Fun├º├úo personalizada para renderizar labels no gr├ífico de rosca
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    );
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (!isSubscriber && questionsAnswered >= 5) {
      setShowUpgradeModal(true);
      return;
    }

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const sendPerformanceUpdate = useCallback(async (isCorrect: boolean) => {
    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (!token) return;

      const payload = {
        data_gravacao: new Date().toISOString(),
        questoes_corretas: isCorrect ? 1 : 0,
        questoes_erradas: isCorrect ? 0 : 1,
        total_questoes: 1
      };

      const response = await fetch(PERFORMANCE_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Falha ao atualizar desempenho (${response.status})`);
      }
    } catch (requestError) {
      console.error('Erro ao atualizar desempenho', requestError);
    }
  }, []);

  const handleAnswerSubmit = (questionId: string) => {
    if (!selectedAnswers[questionId]) return;
    if (answeredQuestions[questionId]) return;
    const question = questions.find((item) => item.id === questionId);
    const isCorrect = Boolean(question?.correctAnswer) &&
      selectedAnswers[questionId] === question?.correctAnswer;
    
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));
    
    setQuestionsAnswered(prev => prev + 1);
    void sendPerformanceUpdate(isCorrect);
  };

  const handleStrikeOption = (questionId: string, optionIndex: number) => {
    setStrikedOptions(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.includes(optionIndex)
        ? prev[questionId].filter(i => i !== optionIndex)
        : [...(prev[questionId] || []), optionIndex]
    }));
  };

  const handleNotebookAction = (action: 'create' | 'select') => {
    if (action === 'create' && newNotebookName.trim()) {
      setNotebooks(prev => [...prev, newNotebookName.trim()]);
      setNewNotebookName('');
    }
    setShowNotebookModal(false);
  };

  const handleDisciplineChange = (discipline: string, isSimulation: boolean = false) => {
    if (isSimulation) {
      setSimulationFilters(prev => ({
        ...prev,
        discipline,
        subject: ''
      }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        discipline,
        subject: ''
      }));
    }
  };

  const renderObjectiveQuestions = () => {
    const disciplineFilterMap: Record<string, string[]> = {
      civil: ['direito civil', 'civil'],
      constitucional: ['direito constitucional', 'constitucional'],
      penal: ['direito penal', 'penal']
    };
    const institutionFilterMap: Record<string, string[]> = {
      fgv: ['fgv'],
      cespe: ['cespe', 'cebraspe']
    };
    const normalizedDiscipline = normalizeFilterValue(selectedFilters.discipline);
    const normalizedSubject = normalizeFilterValue(selectedFilters.subject);
    const normalizedInstitution = normalizeFilterValue(selectedFilters.institution);
    const normalizedYear = selectedFilters.year.trim();
    const normalizedDifficulty = normalizeFilterValue(selectedFilters.difficulty);

    const filteredQuestions = questions.filter((question) => {
      if (normalizedDiscipline) {
        const allowed = disciplineFilterMap[normalizedDiscipline] || [];
        const normalizedQuestionDiscipline = normalizeFilterValue(question.discipline);
        if (!allowed.some((entry) => normalizedQuestionDiscipline.includes(entry))) {
          return false;
        }
      }
      if (normalizedSubject) {
        const normalizedQuestionSubject = normalizeFilterValue(question.subject);
        if (!normalizedQuestionSubject.includes(normalizedSubject)) {
          return false;
        }
      }
      if (normalizedInstitution) {
        const allowed = institutionFilterMap[normalizedInstitution] || [];
        const normalizedQuestionInstitution = normalizeFilterValue(question.institution);
        if (!allowed.some((entry) => normalizedQuestionInstitution.includes(entry))) {
          return false;
        }
      }
      if (normalizedYear) {
        if (String(question.year) !== normalizedYear) {
          return false;
        }
      }
      if (normalizedDifficulty) {
        if (normalizeFilterValue(question.difficulty) !== normalizedDifficulty) {
          return false;
        }
      }
      return true;
    });

    return (
      <React.Fragment>
        <FiltersContainer>
        <FilterGroup>
          <label>Disciplina</label>
          <select 
            value={selectedFilters.discipline} 
            onChange={(e) => handleDisciplineChange(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="civil">Direito Civil</option>
            <option value="constitucional">Direito Constitucional</option>
            <option value="penal">Direito Penal</option>
          </select>
        </FilterGroup>

        <FilterGroup>
          <label>Assunto</label>
          <select 
            value={selectedFilters.subject} 
            onChange={(e) => setSelectedFilters(prev => ({...prev, subject: e.target.value}))}
            disabled={!selectedFilters.discipline}
          >
            <option value="">Todos</option>
            {selectedFilters.discipline && subjectsByDiscipline[selectedFilters.discipline]?.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </FilterGroup>
        
        <FilterGroup>
          <label>Institui├º├úo</label>
          <select 
            value={selectedFilters.institution} 
            onChange={(e) => setSelectedFilters(prev => ({...prev, institution: e.target.value}))}
          >
            <option value="">Todas</option>
            <option value="fgv">FGV</option>
            <option value="cespe">CESPE</option>
          </select>
        </FilterGroup>
        
        <FilterGroup>
          <label>Ano</label>
          <select 
            value={selectedFilters.year} 
            onChange={(e) => setSelectedFilters(prev => ({...prev, year: e.target.value}))}
          >
            <option value="">Todos</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </FilterGroup>
        
        <FilterGroup>
          <label>Dificuldade</label>
          <select 
            value={selectedFilters.difficulty} 
            onChange={(e) => setSelectedFilters(prev => ({...prev, difficulty: e.target.value}))}
          >
            <option value="">Todas</option>
            <option value="easy">F├ícil</option>
            <option value="medium">M├®dio</option>
            <option value="hard">Dif├¡cil</option>
          </select>
        </FilterGroup>

        <FontControlGroup>
          <label>Tamanho da Fonte</label>
          <div className="font-controls">
            <button 
              className="font-button"
              onClick={decreaseFontSize}
              disabled={fontSize <= minFontSize}
              title="Diminuir fonte"
            >
              <Minus size={14} />
            </button>
            <span className="font-size">{fontSize}px</span>
            <button 
              className="font-button"
              onClick={increaseFontSize}
              disabled={fontSize >= maxFontSize}
              title="Aumentar fonte"
            >
              <Plus size={14} />
            </button>
          </div>
        </FontControlGroup>

        <Button variant="outline" onClick={() => setSelectedFilters({discipline: '', subject: '', institution: '', year: '', difficulty: '', status: ''})}>
          Limpar Filtros
        </Button>
      </FiltersContainer>

      <QuestionCounter>
        {filteredQuestions.length} questões encontradas
        {!isSubscriber && ` ÔÇó ${5 - questionsAnswered} questões restantes (gratuitas)`}
      </QuestionCounter>

      {questionsLoading ? (
        <Card>Carregando questoes...</Card>
      ) : questionsError ? (
        <Card>{questionsError}</Card>
      ) : filteredQuestions.length === 0 ? (
        <Card>Nenhuma questao encontrada.</Card>
      ) : (
        filteredQuestions.map((question, index) => {
        const isAnswered = answeredQuestions[question.id];
        const userAnswer = selectedAnswers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;

        return (
          <QuestionItem 
            key={question.id}
            answered={isAnswered}
            correct={isCorrect}
            fontSize={fontSize}
          >
            <QuestionHeader>
              <div className="question-info">
                <div className="meta">
                  <span className="tag">{question.discipline}</span>
                  <span className="tag">{question.subject}</span>
                  {(question.institution || question.year) && (
                    <span className="tag">
                      {[question.institution, question.year || '']
                        .filter(Boolean)
                        .join(' ')}
                    </span>
                  )}
                  <span className="tag">{getDifficultyLabel(question.difficulty)}</span>
                </div>
              </div>
            </QuestionHeader>

            <QuestionText fontSize={fontSize}>
              <strong>Questão {index + 1}:</strong> {question.question}
            </QuestionText>
            <div style={{ height: 12 }} />

            {question.type === 'multiple' && question.options && (
              <OptionsContainer>
                {question.options.map((option, optionIndex) => {
                  const letter = String.fromCharCode(97 + optionIndex);
                  const isSelected = selectedAnswers[question.id] === letter;
                  const isStriked = strikedOptions[question.id]?.includes(optionIndex);
                  const isCorrectOption = isAnswered && question.correctAnswer === letter;
                  const isIncorrectOption = isAnswered && isSelected && question.correctAnswer !== letter;

                  return (
                    <Option
                      key={optionIndex}
                      selected={isSelected}
                      correct={isCorrectOption}
                      incorrect={isIncorrectOption}
                      striked={isStriked}
                      fontSize={fontSize}
                      onClick={() => !isAnswered && handleAnswerSelect(question.id, letter)}
                    >
                      <div className="option-letter">{letter}</div>
                      <div className="option-text">{option}</div>
                      {!isAnswered && (
                        <button
                          className="strike-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStrikeOption(question.id, optionIndex);
                          }}
                        >
                          <Scissors size={12} />
                        </button>
                      )}
                    </Option>
                  );
                })}
              </OptionsContainer>
            )}

            {!isAnswered && (
              <AnswerButton 
                onClick={() => handleAnswerSubmit(question.id)}
                disabled={!selectedAnswers[question.id]}
              >
                Responder
              </AnswerButton>
            )}

            {isAnswered && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                background: isCorrect ? '#22c55e15' : '#db302615',
                color: isCorrect ? '#22c55e' : '#db3026',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                {isCorrect ? '✓ Resposta Correta!' : '✗ Resposta Incorreta'}
              </div>
            )}

            {isAnswered && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                background: '#f8fafc',
                color: '#0f172a',
                marginBottom: '16px'
              }}>
                <strong>Gabarito:</strong>{' '}
                {question.correctAnswer
                  ? question.correctAnswer.toUpperCase()
                  : 'Nao informado'}
              </div>
            )}

            <QuestionTabs>
              {questionTabs.map(tab => (
                <QuestionTab
                  key={tab.id}
                  active={activeQuestionTab === tab.id}
                  onClick={() => setActiveQuestionTab(tab.id)}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </QuestionTab>
              ))}
            </QuestionTabs>

            {questionTabs.map(tab => (
              <TabContent key={tab.id} active={activeQuestionTab === tab.id} fontSize={fontSize}>
                {tab.id === 'explanation' && (
                  <div>
                    {!isSubscriber ? (
                      <div>
                        <p>­ƒöÆ Conte├║do exclusivo para assinantes</p>
                        <Button onClick={() => setShowUpgradeModal(true)}>
                          Fazer upgrade
                        </Button>
                      </div>
                    ) : isAnswered ? (
                      <div>
                        <strong>Gabarito:</strong> {question.correctAnswer}<br />
                        <strong>Explicação:</strong> {question.explanation}
                      </div>
                    ) : (
                      <div>
                        <p>Responda a questão para ver o gabarito comentado</p>
                      </div>
                    )}
                  </div>
                )}
                {tab.id === 'notebook' && (
                  <div>
                    <p>Gerenciar cadernos de estudo:</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      <Button variant="outline" onClick={() => setShowNotebookModal(true)}>
                        <Plus size={14} />
                        Novo Caderno
                      </Button>
                      <select style={{ padding: '8px', flex: '1', minWidth: '150px' }}>
                        <option>Selecionar caderno existente</option>
                        {notebooks.map(notebook => (
                          <option key={notebook} value={notebook}>{notebook}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {tab.id === 'report' && (
                  <div>
                    <textarea 
                      placeholder="Descreva o erro encontrado na questão..."
                      style={{ width: '100%', minHeight: '100px', marginBottom: '12px', boxSizing: 'border-box' }}
                    />
                    <Button>Enviar</Button>
                  </div>
                )}
              </TabContent>
            ))}
          </QuestionItem>
        );
        })
      )}
      </React.Fragment>
    );
  };

  const renderDiscursiveQuestions = () => (
    <>
      <FiltersContainer>
        <FilterGroup>
          <label>Ano</label>
          <select>
            <option value="">Todos</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>Disciplina</label>
          <select>
            <option value="">Todas</option>
            <option value="civil">Direito Civil</option>
            <option value="penal">Direito Penal</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>├ôrg├úo</label>
          <select>
            <option value="">Todos</option>
            <option value="oab">OAB</option>
          </select>
        </FilterGroup>

        <FontControlGroup>
          <label>Tamanho da Fonte</label>
          <div className="font-controls">
            <button 
              className="font-button"
              onClick={decreaseFontSize}
              disabled={fontSize <= minFontSize}
              title="Diminuir fonte"
            >
              <Minus size={14} />
            </button>
            <span className="font-size">{fontSize}px</span>
            <button 
              className="font-button"
              onClick={increaseFontSize}
              disabled={fontSize >= maxFontSize}
              title="Aumentar fonte"
            >
              <Plus size={14} />
            </button>
          </div>
        </FontControlGroup>
      </FiltersContainer>

      <QuestionCounter>
        {mockDiscursiveQuestions.length} questões encontradas
      </QuestionCounter>

      {mockDiscursiveQuestions.map((question, index) => (
        <QuestionItem key={question.id} fontSize={fontSize}>
          <QuestionHeader>
            <div className="question-info">
              <div className="meta">
                <span className="tag">{question.discipline}</span>
                <span className="tag">{question.subject}</span>
                <span className="tag">{question.institution}</span>
                <span className="tag">{question.year}</span>
              </div>
            </div>
          </QuestionHeader>

          <QuestionText fontSize={fontSize}>
            <strong>Questão {index + 1}:</strong> {question.question}
          </QuestionText>

          <DiscursiveAnswer 
            fontSize={fontSize}
            placeholder="Digite sua resposta (m├¡nimo 10 caracteres)..."
            minLength={10}
          />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Button>Enviar Resposta</Button>
            <Button variant="outline">Reenviar</Button>
            <Button variant="outline">Corre├º├úo por IA</Button>
          </div>

          <TabContent active={true} fontSize={fontSize}>
            <strong>Espelho de Resposta:</strong><br />
            {question.referenceAnswer}
          </TabContent>
        </QuestionItem>
      ))}
    </>
  );

  const renderExams = () => (
    <>
      <SearchContainer>
        <input 
          type="text"
          placeholder="Busque por provas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button>
          <Search size={16} />
          Buscar
        </Button>
      </SearchContainer>

      <ExamList>
        {mockExams.map(exam => (
          <ExamCard key={exam.id}>
            <div className="exam-info">
              <h3>{exam.name}</h3>
              <div className="exam-meta">{exam.year}</div>
            </div>
            <div className="exam-actions">
              <Button>
                <Play size={16} />
                Resolver Online
              </Button>
              <DownloadGroup>
                <Button variant="outline" className="download-btn">
                  <Download size={12} />
                  Edital
                </Button>
                <Button variant="outline" className="download-btn">
                  <Download size={12} />
                  Prova
                </Button>
                <Button variant="outline" className="download-btn">
                  <Download size={12} />
                  Gabarito
                </Button>
              </DownloadGroup>
            </div>
          </ExamCard>
        ))}
      </ExamList>
    </>
  );

  const renderSimulations = () => (
    <>
      <SimulationFilters>
        <FilterGroup>
          <label>Disciplina</label>
          <select 
            value={simulationFilters.discipline} 
            onChange={(e) => handleDisciplineChange(e.target.value, true)}
          >
            <option value="">Todas</option>
            <option value="civil">Direito Civil</option>
            <option value="constitucional">Direito Constitucional</option>
            <option value="penal">Direito Penal</option>
          </select>
        </FilterGroup>

        <FilterGroup>
          <label>Assunto</label>
          <select 
            value={simulationFilters.subject} 
            onChange={(e) => setSimulationFilters(prev => ({...prev, subject: e.target.value}))}
            disabled={!simulationFilters.discipline}
          >
            <option value="">Todos</option>
            {simulationFilters.discipline && subjectsByDiscipline[simulationFilters.discipline]?.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </FilterGroup>

        <Button variant="outline" onClick={() => setSimulationFilters({discipline: '', subject: ''})}>
          Limpar Filtros
        </Button>
      </SimulationFilters>

      <ExamList>
        <ExamCard>
          <div className="exam-info">
            <h3>Simulado Direito Civil - LINDB</h3>
            <div className="exam-meta">20 questões ÔÇó Tempo estimado: 40 min</div>
          </div>
          <div className="exam-actions">
            <Button>
              <Play size={16} />
              Resolver Online
            </Button>
          </div>
        </ExamCard>
        
        <ExamCard>
          <div className="exam-info">
            <h3>Simulado Direito Constitucional - Poder Legislativo</h3>
            <div className="exam-meta">15 questões ÔÇó Tempo estimado: 30 min</div>
          </div>
          <div className="exam-actions">
            <Button>
              <Play size={16} />
              Resolver Online
            </Button>
          </div>
        </ExamCard>
      </ExamList>
    </>
  );

  const renderPerformance = () => (
  <>
    <FiltersContainer>
      <FilterGroup>
        <label>Periodo</label>
        <select
          value={performancePeriod}
          onChange={(event) => setPerformancePeriod(event.target.value)}
          disabled={performanceLoading}
        >
          <option value="all">Desde o inicio</option>
          <option value="today">Hoje</option>
          <option value="7days">Ultimos 7 dias</option>
          <option value="15days">Ultimos 15 dias</option>
          <option value="30days">Ultimos 30 dias</option>
        </select>
      </FilterGroup>
    </FiltersContainer>

    {performanceError && (
      <Card>{performanceError}</Card>
    )}

    <PerformanceGrid>
      <StatCard>
        <div className="stat-number">{performanceSummary.totalQuestions}</div>
        <div className="stat-label">Total de Questoes</div>
      </StatCard>
      <StatCard>
        <div className="stat-number">{performanceSummary.accuracyPercentage}%</div>
        <div className="stat-label">Percentual de Acertos</div>
      </StatCard>
      <StatCard>
        <div className="stat-number">{performanceSummary.correctAnswers}</div>
        <div className="stat-label">Questoes Corretas</div>
      </StatCard>
      <StatCard>
        <div className="stat-number">{performanceSummary.incorrectAnswers}</div>
        <div className="stat-label">Questoes Erradas</div>
      </StatCard>
    </PerformanceGrid>

    <ChartContainer>
      <ChartCard>
        <h3>Evolucao de Acertos</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            {performanceView === 'bar' ? (
              <RechartsBarChart data={performanceSummary.evolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="acertos" fill="#22c55e" name="Acertos" />
                <Bar dataKey="erros" fill="#ef4444" name="Erros" />
              </RechartsBarChart>
            ) : (
              <LineChart data={performanceSummary.evolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="acertos"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Acertos"
                />
                <Line
                  type="monotone"
                  dataKey="erros"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Erros"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Button
            variant="outline"
            onClick={() => setPerformanceView('bar')}
            style={{
              background: performanceView === 'bar' ? '#e5e7eb' : 'transparent'
            }}
          >
            Barras
          </Button>
          <Button
            variant="outline"
            onClick={() => setPerformanceView('line')}
            style={{
              background: performanceView === 'line' ? '#e5e7eb' : 'transparent'
            }}
          >
            Linhas
          </Button>
        </div>
      </ChartCard>

      <ChartCard>
        <h3>Distribuicao de Acertos</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} questoes (${pieData.find(item => item.name === name)?.percentage}%)`,
                  name
                ]}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </ChartContainer>
  </>
);

  return (
    <QuestionsContainer>
      <Header>
        <h1>Sistema de Questões</h1>
        <p>Pratique com milhares de questões comentadas</p>
      </Header>

      <TabContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </Tab>
        ))}
      </TabContainer>

      {activeTab === 'objective' && renderObjectiveQuestions()}
      {activeTab === 'discursive' && renderDiscursiveQuestions()}
      {activeTab === 'exams' && renderExams()}
      {activeTab === 'simulations' && renderSimulations()}
      {activeTab === 'performance' && renderPerformance()}

      {showNotebookModal && (
        <NotebookModal onClick={() => setShowNotebookModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Criar Novo Caderno</h3>
            <input
              type="text"
              placeholder="Nome do caderno..."
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
            />
            <div className="modal-actions">
              <Button onClick={() => handleNotebookAction('create')}>
                Criar
              </Button>
              <Button variant="outline" onClick={() => setShowNotebookModal(false)}>
                Cancelar
              </Button>
            </div>
          </ModalContent>
        </NotebookModal>
      )}
    </QuestionsContainer>
  );
};

export default SistemaQuestoes;







