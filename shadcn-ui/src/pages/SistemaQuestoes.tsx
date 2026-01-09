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
  ChevronDown,
  X,
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
  bank: string;
  contest: string;
  questionNumber: string;
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

type QuestionFilterOptions = {
  disciplina: string[];
  assunto: string[];
  banca: string[];
  orgao: string[];
  cargo: string[];
  concurso: string[];
  tipo_questao: string[];
  correcao_questao: string[];
  anulada: boolean[];
  desatualizada: boolean[];
};

type QuestionFilters = {
  texto: string;
  disciplina: string[];
  assunto: string[];
  banca: string[];
  orgao: string[];
  cargo: string[];
  concurso: string[];
  tipo_questao: string[];
  correcao_questao: string[];
  excluirAnulada: boolean;
  excluirDesatualizada: boolean;
};

type MultiFilterKey =
  | 'disciplina'
  | 'assunto'
  | 'banca'
  | 'orgao'
  | 'cargo'
  | 'concurso';

const TOKEN_KEY = 'pantheon:token';
const QUESTIONS_URL = buildApiUrl('/questoes');
const QUESTIONS_SEARCH_URL = buildApiUrl('/questoes/search');
const QUESTIONS_COUNT_URL = buildApiUrl('/questoes/contador');
const PERFORMANCE_URL = buildApiUrl('/meu-desempenho');
const PERFORMANCE_SUMMARY_URL = buildApiUrl('/meu-desempenho/resumo');
const USER_ANSWERS_URL = buildApiUrl('/questoes/respostas');

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

const decodeHtmlEntities = (value: string) => {
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    let decoded = value;
    for (let i = 0; i < 2; i += 1) {
      textarea.innerHTML = decoded;
      const next = textarea.value;
      if (next === decoded) break;
      decoded = next;
    }
    return decoded;
  }

  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&eacute;/gi, 'é')
    .replace(/&aacute;/gi, 'á')
    .replace(/&atilde;/gi, 'ã')
    .replace(/&ccedil;/gi, 'ç')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
};

const normalizeQuestionText = (value: string) => {
  if (!value) return '';
  const decoded = decodeHtmlEntities(value);
  const unescaped = decoded
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, ' ');
  const withBreaks = unescaped.replace(/<br\s*\/?>/gi, '\n');
  const withoutTags = withBreaks.replace(/<\/?[^>]+>/g, '');
  return withoutTags
    .replace(/\r\n/g, '\n')
    .replace(/Explica(?:ç|c)ão:\s*Coment(?:á|a)rios:\s*/gi, '')
    .trim();
};

const normalizeFilterValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const normalizeFilterValues = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry : String(entry ?? '')))
      .map((entry) => entry.trim())
      .filter((entry) => Boolean(entry));
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => Boolean(entry));
  }
  return [];
};

const normalizeBooleanValues = (value: unknown): boolean[] => {
  const normalizeEntry = (entry: unknown): boolean | null => {
    if (typeof entry === 'boolean') return entry;
    if (typeof entry === 'number') return entry !== 0;
    if (typeof entry === 'string') {
      const trimmed = entry.trim().toLowerCase();
      if (!trimmed) return null;
      if (['true', '1', 'sim', 'yes'].includes(trimmed)) return true;
      if (['false', '0', 'nao', 'não', 'no'].includes(trimmed)) return false;
    }
    return null;
  };

  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeEntry(entry))
      .filter((entry): entry is boolean => entry !== null);
  }
  const normalized = normalizeEntry(value);
  return normalized === null ? [] : [normalized];
};

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


const normalizeQuestionsCount = (payload: unknown) => {
  if (typeof payload === 'number' && Number.isFinite(payload)) {
    return Math.max(0, Math.trunc(payload));
  }
  if (isRecord(payload)) {
    const candidates = [
      'count',
      'total',
      'quantidade',
      'total_questoes',
      'totalQuestoes',
      'questoes',
      'contador'
    ];
    for (const key of candidates) {
      const value = payload[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.max(0, Math.trunc(value));
      }
      if (typeof value === 'string') {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          return Math.max(0, Math.trunc(parsed));
        }
      }
    }
  }
  return 0;
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

const normalizeTrueFalseAnswer = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  const normalized = normalizeFilterValue(lower);
  
  // Verifica se é "Certo" ou "Verdadeiro"
  if (normalized.includes('certo') || normalized.includes('verdadeiro')) {
    return 'certo';
  }
  // Verifica se é "Errado" ou "Falso"
  if (normalized.includes('errado') || normalized.includes('falso')) {
    return 'errado';
  }
  
  return '';
};

const extractQuestionOptions = (record: UnknownRecord): string[] => {
  const splitSingleOption = (options: string[]) => {
    if (options.length !== 1) return options;
    const raw = options[0].trim();
    if (!raw) return options;
    const unescaped = raw
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\n')
      .replace(/\\t/g, ' ')
      .trim();
    if (unescaped.includes('",')) {
      const stripped = unescaped.replace(/^\[\s*"/, '').replace(/"\s*\]$/, '');
      const pieces = stripped
        .split(/"\s*,\s*"/)
        .map((item) => item.replace(/^[\[\s"]+|[\]\s"]+$/g, '').trim())
        .filter(Boolean);
      if (pieces.length > 1) return pieces;
    }
    const normalized = normalizeFilterValue(unescaped);
    const parts = unescaped
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (parts.length > 1) return parts;
    if (normalized.includes('certo') && normalized.includes('errado')) {
      const trueFalseParts = raw
        .split(/\s*(?:,|;|\||\/|\n|\r|\bou\b)\s*/i)
        .map((item) => item.trim())
        .filter(Boolean);
      if (trueFalseParts.length >= 2) {
        const trimmedParts = trueFalseParts.filter(
          (item) =>
            normalizeFilterValue(item).includes('certo') ||
            normalizeFilterValue(item).includes('errado')
        );
        if (trimmedParts.length >= 2) return trimmedParts;
      }
    }
    return options;
  };

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
  if (alternativeValues.length) return splitSingleOption(alternativeValues);

  const raw =
    record['alternativas'] ??
    record['opcoes'] ??
    record['opcoes_texto'] ??
    record['options'] ??
    record['alternatives'] ??
    record['respostas'];
  if (Array.isArray(raw)) {
    return splitSingleOption(raw.map((item) => {
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
    }));
  }
  if (isRecord(raw)) {
    return splitSingleOption(Object.values(raw).map((value) => {
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
    }));
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return splitSingleOption(parsed
          .map((item) => normalizeQuestionText(String(item ?? '')))
          .filter((value) => value));
      }
      if (isRecord(parsed)) {
        return splitSingleOption(Object.values(parsed)
          .map((item) => normalizeQuestionText(String(item ?? '')))
          .filter((value) => value));
      }
    } catch (error) {
      return splitSingleOption([normalizeQuestionText(raw)].filter((value) => value));
    }
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
  if (value === 'easy') return 'Fácil';
  if (value === 'hard') return 'Difícil';
  return 'Médio';
};

const formatTipoQuestaoLabel = (value: string) => {
  const normalized = normalizeFilterValue(value);
  if (normalized.includes('certo') || normalized.includes('errado')) {
    return 'Certo ou Errado';
  }
  if (normalized.includes('multipla')) return 'Múltipla escolha';
  if (normalized.includes('discursiva')) return 'Discursiva';
  return value || 'Tipo';
};

const formatCorrecaoLabel = (value: string) => {
  const normalized = normalizeFilterValue(value);
  if (normalized.includes('nao') && normalized.includes('resolvida')) return 'Não resolvidas';
  if (normalized.includes('resolvida')) return 'Resolvidas';
  if (normalized.includes('certa') || normalized.includes('correta')) return 'Certas';
  if (normalized.includes('errada') || normalized.includes('incorreta')) return 'Erradas';
  return value || 'Status';
};

const normalizeTipoQuestaoParam = (value: string) => {
  const normalized = normalizeFilterValue(value);
  if (normalized.includes('certo') && normalized.includes('errado')) {
    return 'CERTO_ERRADO';
  }
  return value.trim();
};

const buildQuestionQuery = (
  filters: QuestionFilters,
  page?: number,
  textKey: 'texto' | 'q' = 'texto'
) => {
  const params = new URLSearchParams();
  const entries: Array<[string, string]> = [
    [textKey, filters.texto.trim()],
    ['disciplina', filters.disciplina.map(item => item.trim()).filter(Boolean).join(',')],
    ['assunto', filters.assunto.map(item => item.trim()).filter(Boolean).join(',')],
    ['banca', filters.banca.map(item => item.trim()).filter(Boolean).join(',')],
    ['orgao', filters.orgao.map(item => item.trim()).filter(Boolean).join(',')],
    ['cargo', filters.cargo.map(item => item.trim()).filter(Boolean).join(',')],
    ['concurso', filters.concurso.map(item => item.trim()).filter(Boolean).join(',')],
    ['tipo_questao', filters.tipo_questao.map(normalizeTipoQuestaoParam).filter(Boolean).join(',')]
  ];

  entries.forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (filters.excluirAnulada) params.set('anulada', 'false');
  if (filters.excluirDesatualizada) params.set('desatualizada', 'false');
  if (page) params.set('page', String(page));

  const query = params.toString();
  return query ? `?${query}` : '';
};

const normalizeUserAnswer = (value: unknown) => {
  if (!isRecord(value)) return null;
  const questaoIdRaw =
    getFirstString(value, ['questao_id', 'questaoId', 'question_id', 'questionId']) ||
    String(value['questao'] ?? value['id'] ?? '');
  if (!questaoIdRaw) return null;
  const corretaRaw = value['correta'] ?? value['isCorrect'] ?? value['correct'] ?? value['correcao_questao'];
  const correta =
    typeof corretaRaw === 'boolean'
      ? corretaRaw
      : normalizeFilterValue(String(corretaRaw)) === 'true';
  return {
    questaoId: questaoIdRaw,
    correta
  };
};

const matchesAnswerFilter = (filterValue: string, answer?: boolean) => {
  const normalized = normalizeFilterValue(filterValue);
  const isAnswered = typeof answer === 'boolean';
  if (normalized.includes('nao') && normalized.includes('resolv')) return !isAnswered;
  if (normalized.includes('resolv')) return isAnswered;
  if (normalized.includes('certa')) return isAnswered && answer === true;
  if (normalized.includes('errada')) return isAnswered && answer === false;
  return true;
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
  
  const disciplina = getFirstString(record, [
    'area_conhecimento',
    'areaConhecimento',
    'disciplina'
  ]);
  const assunto = getFirstString(record, ['assunto', 'tema', 'topico', 'cargo']);
  const banca = getFirstString(record, ['banca', 'banca_nome', 'nome_banca']);
  const instituicao = getFirstString(record, ['orgao', 'instituicao']);
  const concurso = getFirstString(record, [
    'concurso',
    'concurso_nome',
    'nome_concurso',
    'concursoNome'
  ]);
  const anoRaw = getFirstString(record, ['ano', 'year', 'concurso_ano', 'concursoAno']);
  const difficultyValue = normalizeDifficulty(
    getFirstString(record, ['dificuldade', 'difficulty'], 'medium')
  );
  const questionTypeRaw = getFirstString(record, ['tipo_questao', 'tipoQuestao']);
  const normalizedQuestionType = normalizeFilterValue(questionTypeRaw);
  const questionType: Question['type'] =
    normalizedQuestionType.includes('certo') ||
    normalizedQuestionType.includes('errado') ||
    normalizedQuestionType.includes('verdadeiro') ||
    normalizedQuestionType.includes('falso')
      ? 'true-false'
      : 'multiple';
  
  // Determinar a resposta correta baseado no tipo de questão
  let correctAnswer = '';
  if (questionType === 'true-false') {
    // Para questões verdadeiro/falso, normalizar para "certo" ou "errado"
    const trueFalseAnswer = normalizeTrueFalseAnswer(
      getFirstString(record, [
        'resposta_correta',
        'respostaCorreta',
        'gabarito',
        'alternativa_correta',
        'alternativaCorreta',
        'alternativa_a',
        'alternativa_b'
      ])
    );
    if (trueFalseAnswer) {
      correctAnswer = trueFalseAnswer;
    } else if (numeroAlternativaCorreta === 1) {
      correctAnswer = 'certo';
    } else if (numeroAlternativaCorreta === 2) {
      correctAnswer = 'errado';
    }
  } else {
    // Para questões de múltipla escolha, normalizar para letra (a-e)
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
    correctAnswer = answerFromNumber || answerFromText;
  }
  const gabarito = normalizeQuestionText(getString(record, 'gabarito'));
  const comentario = normalizeQuestionText(getString(record, 'comentario'));
  const resolucao = normalizeQuestionText(
    getFirstString(record, ['resolucao_banca', 'resolucaoBanca'])
  );
  const explanation = [gabarito, comentario, resolucao].filter(Boolean).join('\n\n');
  const yearNumber = Number.parseInt(anoRaw || concurso, 10);
  const questionNumber = getFirstString(record, [
    'numero',
    'numero_questao',
    'numeroQuestao',
    'codigo',
    'codigo_questao',
    'codigoQuestao',
    'id_questao',
    'idQuestao',
    'id'
  ]);

  return {
    id: getFirstString(
      record,
      ['questao_id', 'questaoId', 'id', 'uuid', 'id_questao', 'idQuestao'],
      String(index)
    ),
    type: questionType,
    subject: assunto || '-',
    discipline: disciplina || '-',
    bank: banca || '-',
    contest: concurso || '-',
    questionNumber: questionNumber || '-',
    institution: instituicao || '-',
    year: Number.isNaN(yearNumber) ? 0 : yearNumber,
    difficulty: difficultyValue as Question['difficulty'],
    question: normalizeQuestionText(enunciadoRaw) || 'Enunciado não informado.',
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

const Tab = styled.button<{ $active: boolean }>`
  padding: 16px 24px;
  border: none;
  background: ${props => props.$active ? props.theme.colors.accent : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: ${props => props.$active ? 'none' : `1px solid ${props.theme.colors.border}`};
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    color: ${props => props.$active ? 'white' : props.theme.colors.accentSecondary};
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

const FiltersCard = styled(Card)`
  padding: 20px;
  margin-bottom: 16px;

  ${media.mobile} {
    padding: 16px;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const FiltersActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;

  ${media.mobile} {
    justify-content: flex-start;
  }
`;

const FilterLinkButton = styled.button`
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.accentSecondary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
`;

const AdvancedFilters = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SelectedFilters = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AdvancedFiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const AdvancedFiltersLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  border: 1px solid ${props => props.$active ? props.theme.colors.accent : props.theme.colors.border};
  background: ${props => props.$active ? `${props.theme.colors.accent}15` : props.theme.colors.background};
  color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    border-color: ${props => props.theme.colors.accentSecondary};
    color: ${props => props.theme.colors.accentSecondary};
  }
`;

const QuestionCountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
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

  input {
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

const MultiSelectWrapper = styled.div`
  position: relative;
`;

const MultiSelectButton = styled.button<{ $open?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accentSecondary};
  }

  ${props => props.$open && `
    border-color: ${props.theme.colors.accentSecondary};
    box-shadow: 0 0 0 2px ${props.theme.colors.accentSecondary}20;
  `}
`;

const MultiSelectMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  z-index: 20;
  box-shadow: 0 10px 30px ${props => props.theme.colors.shadow};
  padding: 10px;
`;

const MultiSelectSearch = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 8px;
`;

const MultiSelectList = styled.div`
  max-height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MultiSelectOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  padding: 4px 2px;
  cursor: pointer;
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

const QuestionItem = styled(Card)<{ $answered?: boolean; $correct?: boolean; $fontSize?: number }>`
  margin-bottom: 24px;
  ${props => props.$answered && `
    border-left: 4px solid ${props.$correct ? props.theme.colors.success : props.theme.colors.error};
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

    .question-heading {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
      flex-wrap: wrap;

      .question-index {
        font-size: 16px;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
      }

      .question-code {
        background: ${props => props.theme.colors.surface};
        border: 1px solid ${props => props.theme.colors.border};
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: ${props => props.theme.colors.text};
      }
    }

    .question-detail {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 13px;
      color: ${props => props.theme.colors.textSecondary};
      margin-bottom: 10px;

      strong {
        color: ${props => props.theme.colors.text};
        font-weight: 600;
      }
    }
    
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

const QuestionText = styled.div<{ $fontSize?: number }>`
  font-size: ${props => props.$fontSize || 16}px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
  margin-bottom: 20px;

  ${media.mobile} {
    font-size: ${props => Math.max((props.$fontSize || 16) - 2, 14)}px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  strong {
    font-weight: 600;
  }
`;

const OptionsContainer = styled.div<{ $isTrueFalse?: boolean }>`
  margin-bottom: 20px;
  display: ${props => props.$isTrueFalse ? 'flex' : 'block'};
  flex-direction: ${props => props.$isTrueFalse ? 'column' : 'row'};
  gap: ${props => props.$isTrueFalse ? '8px' : '0'};

  ${media.mobile} {
    margin-bottom: 16px;
    gap: ${props => props.$isTrueFalse ? '6px' : '0'};
  }
`;

const Option = styled.div<{ 
  $selected?: boolean; 
  $correct?: boolean; 
  $incorrect?: boolean; 
  $striked?: boolean;
  $fontSize?: number;
  $isTrueFalse?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: ${props => props.$isTrueFalse ? '0' : '8px'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  opacity: ${props => props.$striked ? 0.4 : 1};
  text-decoration: ${props => props.$striked ? 'line-through' : 'none'};
  font-size: ${props => props.$fontSize || 16}px;
  flex: ${props => props.$isTrueFalse ? 'auto' : 'auto'};
  justify-content: ${props => props.$isTrueFalse ? 'center' : 'flex-start'};
  width: ${props => props.$isTrueFalse ? '100%' : 'auto'};

  ${media.mobile} {
    gap: 8px;
    padding: ${props => props.$isTrueFalse ? '10px 8px' : '10px'};
    font-size: ${props => Math.max((props.$fontSize || 16) - 2, 14)}px;
    margin-bottom: ${props => props.$isTrueFalse ? '0' : '6px'};
  }

  background: ${props => {
    if (props.$correct) return `${props.theme.colors.success}15`;
    if (props.$incorrect) return '#db302615';
    if (props.$selected) return `${props.theme.colors.accent}15`;
    return 'transparent';
  }};

  border-color: ${props => {
    if (props.$correct) return props.theme.colors.success;
    if (props.$incorrect) return '#db3026';
    if (props.$selected) return props.theme.colors.accent;
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
    flex: ${props => props.$isTrueFalse ? 'auto' : '1'};
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

const QuestionTab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.surface};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
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
    background: ${props => props.$active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    border-color: ${props => props.theme.colors.accentSecondary};
    color: ${props => props.$active ? 'white' : props.theme.colors.accentSecondary};
  }
`;

const TabContent = styled.div<{ $active: boolean; $fontSize?: number }>`
  display: ${props => props.$active ? 'block' : 'none'};
  margin-top: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  line-height: 1.6;
  font-size: ${props => props.$fontSize || 16}px;

  ${media.mobile} {
    padding: 12px;
    font-size: ${props => Math.max((props.$fontSize || 16) - 2, 14)}px;
    margin-top: 12px;
  }
`;

const DiscursiveAnswer = styled.textarea<{ $fontSize?: number }>`
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-family: inherit;
  font-size: ${props => props.$fontSize || 14}px;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  ${media.mobile} {
    min-height: 120px;
    padding: 10px;
    font-size: ${props => Math.max((props.$fontSize || 14) - 1, 13)}px;
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

const initialQuestionFilters: QuestionFilters = {
  texto: '',
  disciplina: [],
  assunto: [],
  banca: [],
  orgao: [],
  cargo: [],
  concurso: [],
  tipo_questao: [],
  correcao_questao: [],
  excluirAnulada: false,
  excluirDesatualizada: false
};

const DISCIPLINE_OPTIONS = [
  'administracao-de-recursos-materiais',
  'administracao-geral-e-publica',
  'afo-direito-financeiro-e-contabilidade-publica',
  'analise-das-demonstracoes-contabeis',
  'antropologia',
  'arquitetura',
  'arquivologia',
  'artes-e-musica',
  'atualidades-e-conhecimentos-gerais',
  'auditoria-governamental-e-controle',
  'auditoria-privada',
  'biblioteconomia',
  'biologia-e-biomedicina',
  'ciencias-politicas',
  'ciencias-sociais',
  'comunicacao-social',
  'contabilidade-de-custos',
  'contabilidade-de-instituicoes-financeiras-e-atuariais',
  'contabilidade-geral',
  'criminalistica-e-medicina-legal',
  'criminologia',
  'defesa-civil',
  'desenho-tecnico-e-artes-graficas',
  'direito-administrativo',
  'direito-agrario',
  'direito-civil',
  'direito-constitucional',
  'direito-cultural-desportivo-e-da-comunicacao',
  'direito-da-crianca-e-do-adolescente',
  'direito-digital',
  'direito-do-consumidor',
  'direito-do-trabalho',
  'direito-economico',
  'direito-educacional',
  'direito-eleitoral',
  'direito-empresarial-comercial',
  'direito-internacional-publico-e-privado',
  'direito-maritimo-portuario-e-aeronautico',
  'direito-notarial-e-registral',
  'direito-penal-militar',
  'direito-previdenciario',
  'direito-processual-civil',
  'direito-processual-do-trabalho',
  'direito-processual-penal',
  'direito-processual-penal-militar',
  'direito-sanitario-e-saude',
  'direito-tributario',
  'direito-urbanistico',
  'direitos-humanos',
  'economia-e-financas-publicas',
  'educacao-fisica',
  'enfermagem',
  'engenharia-agronomica-e-agricola',
  'engenharia-ambiental-florestal-e-sanitaria',
  'engenharia-civil-e-auditoria-de-obras',
  'engenharia-de-producao',
  'engenharia-eletrica-e-eletronica',
  'engenharia-mecanica',
  'estatistica',
  'etica-no-servico-publico',
  'farmacia',
  'filosofia-e-teologia',
  'financas-e-conhecimentos-bancarios',
  'fisica',
  'fisioterapia',
  'fonoaudiologia',
  'geografia',
  'geologia-e-engenharia-de-minas',
  'gestao-de-projetos-pmbok',
  'historia',
  'informatica',
  'legislacao-aduaneira',
  'legislacao-civil-e-processual-civil-especial',
  'legislacao-das-casas-legislativas',
  'legislacao-de-transito-e-transportes',
  'legislacao-e-etica-profissional',
  'legislacao-especifica-das-agencias-reguladoras',
  'legislacao-especifica-das-defensorias-publicas',
  'legislacao-especifica-dos-ministerios-publicos',
  'legislacao-especifica-dos-tribunais-estaduais',
  'legislacao-especifica-dos-tribunais-federais',
  'legislacao-geral-estadual-e-do-df',
  'legislacao-geral-municipal',
  'legislacao-militar',
  'legislacao-penal-e-processual-penal-especial',
  'legislacao-tributaria-dos-estados-e-do-distrito-federal',
  'legislacao-tributaria-dos-municipios',
  'legislacao-tributaria-federal',
  'libras-inclusao-e-taquigrafia',
  'lingua-portuguesa-portugues',
  'matematica',
  'matematica-financeira',
  'medicina',
  'nutricao-gastronomia-e-engenharia-de-alimentos',
  'odontologia',
  'pedagogia',
  'psicologia',
  'raciocinio-logico',
  'redacao-oficial',
  'relacoes-internacionais-e-comercio-internacional',
  'secretariado',
  'seguranca-e-protecao-contra-incendios',
  'seguranca-e-saude-no-trabalho-sst',
  'seguranca-privada-e-transportes',
  'seguranca-publica-e-legislacao-policial',
  'servicos-gerais',
  'teoria-geral-filosofia-e-sociologia-juridica',
  'ti-banco-de-dados',
  'ti-desenvolvimento-de-sistemas',
  'ti-engenharia-de-software',
  'ti-gestao-e-governanca-de-ti',
  'ti-organizacao-e-arquitetura-dos-computadores',
  'ti-redes-de-computadores',
  'ti-seguranca-da-informacao',
  'ti-sistemas-operacionais',
  'turismo'
];


const SUBJECT_OPTIONS_BY_DISCIPLINE: Record<string, string[]> = {
  'administracao-de-recursos-materiais': [
    'Administração Patrimonial',
    'Armazenagem (Almoxarifado)',
    'Avaliação de Estoques e Custos',
    'Ciclo, Etapas e Modalidades de Compras',
    'Compras no Setor Público',
    'Gestão da cadeia de suprimentos',
    'Etapas da Classificação de Materiais',
    'Instrução Normativa nº 205/1998',
    'Inventário (Materiais)',
    'Localização de Unidades e Layout (Almoxarifado)',
    'Lote Econômico de Compras (LEC)',
    'Modalidades de Transporte',
    'Movimentação de Materiais',
    'Noções da Gestão de Compras',
    'Noções de Administração de Materiais',
    'Noções de Administração de Materiais no Setor Público',
    'Noções de Classificação de Materiais',
    'Noções de Gestão de Estoques',
    'Noções de Logística',
    'Noções de Recebimento e Armazenagem',
    'Outros Assuntos de Administração de Materiais',
    'Planejamento das Necessidades de Materiais - MRP',
    'Planejamento e Controle de Estoques',
    'Previsão para Estoques',
    'Recebimento',
    'Sistemas de Reposição e Níveis de Estoque',
    'Sistemas Logísticos',
    'Tipos de Classificação e Identificação de Materiais',
    'Transportes e Distribuição de Materiais'
  ]
};

const SUBJECT_OPTIONS = Array.from(
  new Set(Object.values(SUBJECT_OPTIONS_BY_DISCIPLINE).flat())
);

const QUESTION_TYPE_OPTIONS = [
  'multipla escolha',
  'certo ou errado',
  'discursiva'
];

const QUESTION_STATUS_OPTIONS = [
  'nao resolvidas',
  'resolvidas',
  'certas',
  'erradas'
];

const BANK_OPTIONS = [
  'ADM&TEC',
  'AMAUC',
  'AOCP',
  'Ápice',
  'CCMPM',
  'CEBRASPE (CESPE)',
  'CEFETBAHIA',
  'CEPS UFPA',
  'CESGRANRIO',
  'CETAP',
  'CETRO',
  'CEV UECE',
  'CEV URCA',
  'Com. Conc. MPE BA',
  'Com. Exam. (MPDFT)',
  'Com. Exam. (MPE AP)',
  'Com. Exam. (MPE GO)',
  'Com. Exam. (MPE MA)',
  'Com. Exam. (MPE MS)',
  'Com. Exam. (MPE PB)',
  'Com. Exam. (MPE PR)',
  'Com. Exam. (MPE RS)',
  'Com. Exam. (MPE SC)',
  'Com. Exam. (MPE SP)',
  'Com. Exam. (MPT)',
  'Com. Exam. (MPF)',
  'Com. Exam. (PGE RJ)',
  'Com. Exam. (TJ SC)',
  'Com. OAB GO',
  'CONESUL',
  'CONSEP',
  'CONSULPLAN',
  'CONSULTEC',
  'CONTEMAX',
  'COPERVE UFPB',
  'COPERVE UFSC',
  'COPESE-UFT',
  'COPEVE (UFAL)',
  'CPCC UFES',
  'CPCON UEPB',
  'DEIP PMPI',
  'DES IFSUL',
  'EDUCA PB',
  'ESAF',
  'ESAG',
  'ESPP',
  'FACET',
  'FADESP',
  'FAFIPA',
  'FAPERP',
  'FAPEU',
  'FAURGS',
  'FAUSCS',
  'FCC',
  'FEPESE',
  'FGV',
  'FMP',
  'FUMARC',
  'FUNDATEC',
  'FUNDEP',
  'FUNIVERSA',
  'Ganzaroli',
  'IADES',
  'IAUPE',
  'IBADE',
  'IBFC',
  'IBGP',
  'IBRASP',
  'IDCAP',
  'IDECAN',
  'IESES',
  'IDIB',
  'IGEDUC',
  'INAZ do Pará',
  'INCAB (ex-FUNCAB)',
  'INSTITUTO ACESSO',
  'Instituto AOCP',
  'Instituto CONSULPAM',
  'Instituto Consulplan',
  'INSTITUTO IBDO',
  'Instituto Verbena',
  'IUDS',
  'Legalle',
  'LJ Assessoria',
  'MSM',
  'NC UFPR (FUNPAR)',
  'NCE e FUJB (UFRJ)',
  'NOSSO RUMO',
  'OBJETIVA CONCURSOS',
  'OMNI',
  'Outras',
  'PLANEXCON',
  'PUC PR',
  'QUADRIX',
  'SELECON',
  'SMA-RJ (antiga FJG)',
  'UEG',
  'UFMT',
  'VUNESP'
];

const CARGO_OPTIONS = [
  'Administrador (AGU)',
  'Administrador Judiciário (TJ SP)',
  'Agente Administrativo (DPE PB)',
  'Agente Administrativo (DPU)',
  'Agente de Defensoria Pública (DPE SP)',
  'Agente Técnico (MPE AM)',
  'Analista (DPE RS)',
  'Analista (MPE SC)',
  'Analista (PGM Nova Iguaçu)',
  'Analista (TJ SC)',
  'Analista da Procuradoria (PGE RO)',
  'Analista do Ministério Público (MPE MG)',
  'Analista do Ministério Público (MPE RJ)',
  'Analista do Ministério Público da União',
  'Analista do Ministério Público de Sergipe',
  'Analista Judiciário (STF)',
  'Analista Judiciário (STM)',
  'Analista Judiciário (TJ AP)',
  'Analista Judiciário (TJ AL)',
  'Analista Judiciário (TJ MA)',
  'Analista Judiciário (TJ PA)',
  'Analista Judiciário (TJ PI)',
  'Analista Judiciário (TRE RS)',
  'Analista Judiciário (TRE AL)',
  'Analista Judiciário (TJ RO)',
  'Analista Judiciário (TRF 1ª Região)',
  'Analista Judiciário (TRF 2ª Região)',
  'Analista Judiciário (TRF 3ª Região)',
  'Analista Judiciário (TRF 4ª Região)',
  'Analista Judiciário (TRT 12ª Região)',
  'Analista Judiciário (TRT 3ª Região)',
  'Analista Judiciário (TRT 8ª Região)',
  'Analista Judiciário (TST)',
  'Analista Judiciário 01 (TJ ES)',
  'Analista Judiciário 02 (TJ ES)',
  'Analista Ministerial (MPE PI)',
  'Analista Ministerial (MPE TO)',
  'Analista Técnico (MPE BA)',
  'Analista Técnico Científico (MPE SP)',
  'Assessor (MPE RS)',
  'Assistente de Procuradoria (PGE PE)',
  'Assistente Judiciário (TJ AM)',
  'Assistente Técnico de Defensoria (DPE AM)',
  'Auxiliar Judiciário (TJ AM)',
  'Auxiliar Judiciário (TJ RR)',
  'Auxiliar Judiciário (TRT 4ª Região)',
  'Nacional Unificado (OAB)',
  'Oficial de Defensoria Pública (DPE SP)',
  'Procurador da República',
  'Procurador do Trabalho',
  'Promotor de Justiça (MPDFT)',
  'Promotor de Justiça (MPE AC)',
  'Promotor de Justiça (MPE AP)',
  'Promotor de Justiça (MPE AM)',
  'Promotor de Justiça (MPE AL)',
  'Promotor de Justiça (MPE BA)',
  'Promotor de Justiça (MPE CE)',
  'Promotor de Justiça (MPE ES)',
  'Promotor de Justiça (MPE GO)',
  'Promotor de Justiça (MPE MA)',
  'Promotor de Justiça (MPE MG)',
  'Promotor de Justiça (MPE MT)',
  'Promotor de Justiça (MPE PB)',
  'Promotor de Justiça (MPE PE)',
  'Promotor de Justiça (MPE PI)',
  'Promotor de Justiça (MPE RO)',
  'Promotor de Justiça (MPE PR)',
  'Promotor de Justiça (MPE RN)',
  'Promotor de Justiça (MPE RR)',
  'Promotor de Justiça (MPE RS)',
  'Promotor de Justiça (MPE SE)',
  'Promotor de Justiça (MPE SC)',
  'Promotor de Justiça (MPE SP)',
  'Promotor de Justiça (MPE TO)',
  'Promotor de Justiça Militar',
  'Seccional OAB de Goiás',
  'Seccional OAB do Rio de Janeiro',
  'Seccional OAB de São Paulo',
  'Técnico (CNMP)',
  'Técnico (DPE RS)',
  'Técnico (PGE RJ)',
  'Técnico de Procuradoria (Pref Niterói)',
  'Técnico do Ministério Público (MPE AL)',
  'Técnico do Ministério Público da União',
  'Técnico Judiciário (CNJ)',
  'Técnico Judiciário (TJ BA)',
  'Técnico Judiciário (TRE GO)',
  'Técnico Judiciário (TRE MT)',
  'Técnico Judiciário (TRE MS)',
  'Técnico Judiciário (TRE RJ)',
  'Técnico Judiciário (TRE RN)',
  'Técnico Judiciário (TRT 10ª Região)',
  'Técnico Judiciário (TRT 17ª Região)',
  'Técnico Judiciário (TRT 6ª Região)',
  'Técnico Judiciário (TRT 8ª Região)',
  'Técnico Judiciário (PGDF)',
  'Técnico Ministerial (MPE PI)',
  'Técnico Superior Especializado (DPE RJ)'
];

const ORGAO_OPTIONS = [
  'AGU',
  'CNJ',
  'CNMP',
  'DPE AM',
  'DPE MS',
  'DPE PB',
  'DPE PR',
  'DPE RJ',
  'DPE RO',
  'DPE RS',
  'DPE SP',
  'DPU',
  'MPE AC',
  'MPDFT',
  'MPE AL',
  'MPE AM',
  'MPE AP',
  'MPE BA',
  'MPE CE',
  'MPE ES',
  'MPE GO',
  'MPE MA',
  'MPE MG',
  'MPE MS',
  'MPE MT',
  'MPE PA',
  'MPE PB',
  'MPE PE',
  'MPE PI',
  'MPE PR',
  'MPE RJ',
  'MPE RN',
  'MPE RO',
  'MPE RR',
  'MPE RS',
  'MPE SC',
  'MPE SE',
  'MPE SP',
  'MPE TO',
  'MPF',
  'MPM',
  'MPT',
  'MPU',
  'OAB',
  'PG DF',
  'PGE MT',
  'PGE PA',
  'PGE PE',
  'PGE RJ',
  'PGE RO',
  'Pref Niterói',
  'Pref Nova Iguaçu',
  'STF',
  'STM',
  'TJ AC',
  'TJ AL',
  'TJ AM',
  'TJ AP',
  'TJ BA',
  'TJ CE',
  'TJ ES',
  'TJ MA',
  'TJ MT',
  'TJ PA',
  'TJ PB',
  'TJ PI',
  'TJ RR',
  'TJ RO',
  'TJ RS',
  'TJ SC',
  'TJ SP',
  'TJ TO',
  'TJM MG',
  'TRE AL',
  'TRE GO',
  'TRE MS',
  'TRE MT',
  'TRE PA',
  'TRE PB',
  'TRE PI',
  'TRE RJ',
  'TRE RN',
  'TRE RS',
  'TRF 2',
  'TRF 1',
  'TRF 3',
  'TRF 4',
  'TRT 10',
  'TRT 12',
  'TRT 16',
  'TRT 17',
  'TRT 2',
  'TRT 21',
  'TRT 3',
  'TRT 6',
  'TRT 4',
  'TRT 8',
  'TRT 9',
  'TSE',
  'TST'
];

const SistemaQuestoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('objective');
  const [activeQuestionTab, setActiveQuestionTab] = useState('explanation');
  const [filters, setFilters] = useState<QuestionFilters>(initialQuestionFilters);
  const [appliedFilters, setAppliedFilters] = useState<QuestionFilters>(initialQuestionFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openFilter, setOpenFilter] = useState<MultiFilterKey | null>(null);
  const [filterSearch, setFilterSearch] = useState<Record<MultiFilterKey, string>>({
    disciplina: '',
    assunto: '',
    banca: '',
    orgao: '',
    cargo: '',
    concurso: ''
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
  const [responseQuestions, setResponseQuestions] = useState<Question[] | null>(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [questionsCount, setQuestionsCount] = useState<number | null>(null);
  const [questionsCountLoading, setQuestionsCountLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions] = useState<QuestionFilterOptions>({
    disciplina: DISCIPLINE_OPTIONS,
    assunto: SUBJECT_OPTIONS,
    banca: BANK_OPTIONS,
    orgao: ORGAO_OPTIONS,
    cargo: CARGO_OPTIONS,
    concurso: [],
    tipo_questao: QUESTION_TYPE_OPTIONS,
    correcao_questao: QUESTION_STATUS_OPTIONS,
    anulada: [true],
    desatualizada: [true]
  });
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  const [userAnswersLoading, setUserAnswersLoading] = useState(false);
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
  const pageSize = 10;

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

  const updateFilter = (field: keyof QuestionFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const updateMultiFilter = (field: MultiFilterKey, value: string) => {
    setFilters(prev => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return {
        ...prev,
        [field]: next,
        ...(field === 'disciplina' ? { assunto: [] } : {})
      };
    });
  };

  const removeMultiFilterValue = (field: MultiFilterKey, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value),
      ...(field === 'disciplina' ? { assunto: [] } : {})
    }));
  };

  const getSubjectOptions = () => {
    if (!filters.disciplina.length) return filterOptions.assunto;
    const mapped = filters.disciplina.flatMap(
      (discipline) => SUBJECT_OPTIONS_BY_DISCIPLINE[discipline] || []
    );
    return mapped.length ? mapped : filterOptions.assunto;
  };

  const toggleFilterValue = (
    field: 'tipo_questao' | 'correcao_questao',
    value: string
  ) => {
    setFilters(prev => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return {
        ...prev,
        [field]: next
      };
    });
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialQuestionFilters);
    setAppliedFilters(initialQuestionFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!openFilter) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-filter-dropdown]')) return;
      setOpenFilter(null);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [openFilter]);

  const loadQuestions = useCallback(async (currentFilters: QuestionFilters, page: number) => {
    setQuestionsLoading(true);
    setQuestionsError(null);
    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
    const hasSearch = currentFilters.texto && currentFilters.texto.trim();
    const query = buildQuestionQuery(currentFilters, page, hasSearch ? 'q' : 'texto');
    const baseUrl = hasSearch ? QUESTIONS_SEARCH_URL : QUESTIONS_URL;
    const response = await fetch(`${baseUrl}${query}`, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar questões (${response.status})`);
      }
      const payload = await response.json();
      setQuestions(normalizeQuestionCollection(payload));
    } catch (requestError) {
      setQuestionsError(
        requestError instanceof Error
          ? requestError.message
          : 'Erro ao carregar questões.'
      );
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  const loadQuestionsCount = useCallback(async (currentFilters: QuestionFilters) => {
    setQuestionsCountLoading(true);
    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
    const hasSearch = currentFilters.texto && currentFilters.texto.trim();
    const query = buildQuestionQuery(currentFilters, undefined, hasSearch ? 'q' : 'texto');
    const response = await fetch(`${QUESTIONS_COUNT_URL}${query}`, { headers });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Falha ao carregar contador (${response.status})`);
      }
      const payload = await response.json();
      setQuestionsCount(normalizeQuestionsCount(payload));
    } catch (requestError) {
      setQuestionsCount(null);
    } finally {
      setQuestionsCountLoading(false);
    }
  }, []);

  const loadPerformanceSummary = useCallback(async (period: string) => {
    setPerformanceLoading(true);
    setPerformanceError(null);
    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (!token) {
        throw new Error('Token não encontrado. Faça login para ver desempenho.');
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
    if (questionsLoading) return;
    void loadQuestions(appliedFilters, currentPage);
  }, [activeTab, appliedFilters, currentPage, loadQuestions]);

  useEffect(() => {
    if (activeTab !== 'objective') return;
    void loadQuestionsCount(appliedFilters);
  }, [activeTab, appliedFilters, loadQuestionsCount]);
  useEffect(() => {
    if (activeTab !== 'performance') return;
    void loadPerformanceSummary(performancePeriod);
  }, [activeTab, loadPerformanceSummary, performancePeriod]);

  useEffect(() => {
    if (!questionsCount) return;
    const totalPages = Math.max(1, Math.ceil(questionsCount / pageSize));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, pageSize, questionsCount]);

  const subjectsByDiscipline: { [key: string]: string[] } = {
    'civil': ['LINDB', 'Domicílio'],
    'constitucional': ['Poder Legislativo', 'Controle de Constitucionalidade'],
    'penal': ['Teoria Geral do Delito', 'Prisão Preventiva']
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
      referenceAnswer: 'A responsabilidade civil possui três elementos essenciais: conduta (ação ou omissão), dano e nexo causal...',
      answered: false
    }
  ];

  const mockExams = [
    { id: '1', name: 'FGV OAB 44º Exame', year: 2025 },
    { id: '2', name: 'FGV OAB 43º Exame', year: 2025 },
    { id: '3', name: 'FGV OAB 42º Exame', year: 2024 },
    { id: '4', name: 'FGV OAB 41º Exame', year: 2024 },
    { id: '5', name: 'FGV OAB 40º Exame', year: 2024 },
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
      name: 'Questões Corretas', 
      value: performanceSummary.correctAnswers, 
      percentage: performanceSummary.totalQuestions
        ? Math.round((performanceSummary.correctAnswers / performanceSummary.totalQuestions) * 100)
        : 0,
      color: '#22c55e' 
    },
    { 
      name: 'Questões Incorretas', 
      value: performanceSummary.incorrectAnswers, 
      percentage: performanceSummary.totalQuestions
        ? Math.round((performanceSummary.incorrectAnswers / performanceSummary.totalQuestions) * 100)
        : 0,
      color: '#db3026'
    }
  ];

  // Função personalizada para renderizar labels no gráfico de rosca
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

  const loadUserAnswers = useCallback(async (status?: string) => {
    setUserAnswersLoading(true);
    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (!token) {
        setUserAnswers({});
        setResponseQuestions(status ? [] : null);
        return;
      }
      const query = status ? `?status=${encodeURIComponent(status)}` : '';
      const response = await fetch(`${USER_ANSWERS_URL}${query}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Falha ao carregar respostas (${response.status})`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.respostas)
          ? payload.respostas
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
      if (status) {
        setResponseQuestions(items.map((item: unknown, index: number) =>
          normalizeQuestionRecord(item, index)
        ));
      } else {
        setResponseQuestions(null);
      }
      const next: Record<string, boolean> = {};
      items.forEach((item: unknown) => {
        const normalized = normalizeUserAnswer(item);
        if (normalized) {
          next[normalized.questaoId] = normalized.correta;
        }
      });
      setUserAnswers(next);
    } catch (requestError) {
      setUserAnswers({});
      setResponseQuestions(null);
    } finally {
      setUserAnswersLoading(false);
    }
  }, []);

  const getRespostaStatusParam = (values: string[]) => {
    if (!values.length) return undefined;
    const normalized = values.map((value) => normalizeFilterValue(value));
    if (normalized.some((value) => value.includes('resolv') && !value.includes('nao'))) {
      return 'resolvidas';
    }
    if (normalized.some((value) => value.includes('certa'))) {
      return 'certas';
    }
    if (normalized.some((value) => value.includes('errada'))) {
      return 'erradas';
    }
    if (normalized.some((value) => value.includes('nao') && value.includes('resolv'))) {
      return 'nao_resolvidas';
    }
    return undefined;
  };




  useEffect(() => {
    if (activeTab !== 'objective') return;
    const statusParam = getRespostaStatusParam(appliedFilters.correcao_questao);
    void loadUserAnswers(statusParam);
  }, [activeTab, appliedFilters.correcao_questao, loadUserAnswers]);
  const sendUserAnswer = useCallback(async (questionId: string, isCorrect: boolean) => {
    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (!token) return;
      const parsedId = Number(questionId);
      const payload = {
        correta: isCorrect,
        questao_id: Number.isNaN(parsedId) ? questionId : parsedId
      };
      const response = await fetch(USER_ANSWERS_URL, {
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
        throw new Error(message || `Falha ao salvar resposta (${response.status})`);
      }
      setUserAnswers(prev => ({
        ...prev,
        [questionId]: isCorrect
      }));
    } catch (requestError) {
      console.error('Erro ao enviar resposta', requestError);
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
    void sendUserAnswer(questionId, isCorrect);
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

  const handleSimulationDisciplineChange = (discipline: string) => {
    setSimulationFilters(prev => ({
      ...prev,
      discipline,
      subject: ''
    }));
  };

  const renderObjectiveQuestions = () => {
    const responseFilterActive = appliedFilters.correcao_questao.length > 0;
    const responseFilteredQuestions = responseFilterActive
      ? responseQuestions ?? []
      : questions;
    const totalCount = responseFilterActive
      ? responseFilteredQuestions.length
      : questionsCount ?? questions.length;
    const countLabel = questionsCountLoading || (responseFilterActive && userAnswersLoading)
      ? 'Carregando...'
      : responseFilterActive
        ? `${responseFilteredQuestions.length.toLocaleString('pt-BR')} questões encontradas`
        : `${totalCount.toLocaleString('pt-BR')} questões encontradas`;
    const totalPages = responseFilterActive
      ? 1
      : Math.max(1, Math.ceil(totalCount / pageSize));
    const subjectOptions = getSubjectOptions();
    const selectedFilterGroups: Array<{
      key: MultiFilterKey;
      label: string;
      values: string[];
    }> = [
      { key: 'disciplina', label: 'Disciplina', values: filters.disciplina },
      { key: 'assunto', label: 'Assunto', values: filters.assunto },
      { key: 'banca', label: 'Banca', values: filters.banca },
      { key: 'orgao', label: 'Instituição', values: filters.orgao },
      { key: 'cargo', label: 'Cargo', values: filters.cargo },
      { key: 'concurso', label: 'Ano', values: filters.concurso }
    ];
    const hasSelectedFilters = selectedFilterGroups.some(group => group.values.length > 0);

    const renderMultiSelect = (
      field: MultiFilterKey,
      label: string,
      options: string[],
      placeholder: string
    ) => {
      const selectedValues = filters[field];
      const searchValue = filterSearch[field] || '';
      const normalizedSearch = normalizeFilterValue(searchValue);
      const filteredOptions = options.filter((option) =>
        normalizeFilterValue(option).includes(normalizedSearch)
      );
      const displayText = selectedValues.length
        ? selectedValues.length === 1
          ? selectedValues[0]
          : `${selectedValues.length} selecionados`
        : placeholder;

      return (
        <FilterGroup>
          <label>{label}</label>
          <MultiSelectWrapper data-filter-dropdown>
            <MultiSelectButton
              type="button"
              $open={openFilter === field}
              onClick={() => setOpenFilter(openFilter === field ? null : field)}
            >
              <span>{displayText}</span>
              <ChevronDown size={16} />
            </MultiSelectButton>
            {openFilter === field && (
              <MultiSelectMenu>
                <MultiSelectSearch
                  type="text"
                  placeholder="Busca rápida"
                  value={searchValue}
                  onChange={(e) =>
                    setFilterSearch(prev => ({ ...prev, [field]: e.target.value }))
                  }
                />
                <MultiSelectList>
                  {filteredOptions.map((option, index) => {
                    const isChecked = selectedValues.includes(option);
                    return (
                      <MultiSelectOption key={`${option}-${index}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => updateMultiFilter(field, option)}
                        />
                        <span>{option}</span>
                      </MultiSelectOption>
                    );
                  })}
                  {filteredOptions.length === 0 && (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Nenhum resultado
                    </span>
                  )}
                </MultiSelectList>
              </MultiSelectMenu>
            )}
          </MultiSelectWrapper>
        </FilterGroup>
      );
    };

    return (
      <React.Fragment>
        <FiltersCard>
          <FiltersGrid>
            <FilterGroup>
              <label>Pesquisar</label>
              <input
                type="text"
                placeholder="Pesquisar"
                value={filters.texto}
                onChange={(e) => updateFilter('texto', e.target.value)}
              />
            </FilterGroup>

            {renderMultiSelect('disciplina', 'Disciplina', DISCIPLINE_OPTIONS, 'Todas')}
            {renderMultiSelect('assunto', 'Assunto', subjectOptions, 'Todos')}
            {renderMultiSelect('banca', 'Banca', BANK_OPTIONS, 'Todas')}
            {renderMultiSelect('orgao', 'Instituição', ORGAO_OPTIONS, 'Todas')}
            {renderMultiSelect('cargo', 'Cargo', CARGO_OPTIONS, 'Todos')}
            {renderMultiSelect(
              'concurso',
              'Ano',
              Array.from({ length: 2025 - 1996 + 1 }, (_, i) => String(2025 - i)),
              'Todos'
            )}
          </FiltersGrid>

          {showAdvancedFilters && (
            <AdvancedFilters>
              {filterOptions.correcao_questao.length > 0 && (
                <AdvancedFiltersRow>
                  <AdvancedFiltersLabel>Minhas questões:</AdvancedFiltersLabel>
                  <FilterChips>
                    {filterOptions.correcao_questao.map((option, index) => (
                      <FilterChip
                        key={`${option}-${index}`}
                        $active={filters.correcao_questao.includes(option)}
                        onClick={() => toggleFilterValue('correcao_questao', option)}
                      >
                        {formatCorrecaoLabel(option)}
                      </FilterChip>
                    ))}
                  </FilterChips>
                </AdvancedFiltersRow>
              )}

              {filterOptions.tipo_questao.length > 0 && (
                <AdvancedFiltersRow>
                  <AdvancedFiltersLabel>Tipo de questão:</AdvancedFiltersLabel>
                  <FilterChips>
                    {filterOptions.tipo_questao.map((option, index) => (
                      <FilterChip
                        key={`${option}-${index}`}
                        $active={filters.tipo_questao.includes(option)}
                        onClick={() => toggleFilterValue('tipo_questao', option)}
                      >
                        {formatTipoQuestaoLabel(option)}
                      </FilterChip>
                    ))}
                  </FilterChips>
                </AdvancedFiltersRow>
              )}

              {(filterOptions.desatualizada.length > 0 || filterOptions.anulada.length > 0) && (
                <AdvancedFiltersRow>
                  <AdvancedFiltersLabel>Excluir questões:</AdvancedFiltersLabel>
                  <FilterChips>
                    <FilterChip
                      $active={filters.excluirDesatualizada}
                      onClick={() =>
                        updateFilter('excluirDesatualizada', !filters.excluirDesatualizada)
                      }
                    >
                      Desatualizadas
                    </FilterChip>
                    <FilterChip
                      $active={filters.excluirAnulada}
                      onClick={() => updateFilter('excluirAnulada', !filters.excluirAnulada)}
                    >
                      Anuladas
                    </FilterChip>
                  </FilterChips>
                </AdvancedFiltersRow>
              )}
            </AdvancedFilters>
          )}

          {hasSelectedFilters && (
            <SelectedFilters>
              {selectedFilterGroups.map(group => (
                group.values.length ? (
                  <AdvancedFiltersRow key={group.key}>
                    <AdvancedFiltersLabel>{group.label}:</AdvancedFiltersLabel>
                    <FilterChips>
                      {group.values.map((value) => (
                        <FilterChip
                          key={`${group.key}-${value}`}
                          $active
                          onClick={() => removeMultiFilterValue(group.key, value)}
                        >
                          {value}
                          <X size={12} />
                        </FilterChip>
                      ))}
                    </FilterChips>
                  </AdvancedFiltersRow>
                ) : null
              ))}
            </SelectedFilters>
          )}

          <FiltersActions>
            <FilterLinkButton
              type="button"
              onClick={() => setShowAdvancedFilters(prev => !prev)}
            >
              {showAdvancedFilters ? 'Filtro simples' : 'Filtro avançado'}
            </FilterLinkButton>
            <FilterLinkButton type="button" onClick={clearFilters}>
              Limpar filtros
            </FilterLinkButton>
            <Button onClick={applyFilters}>Filtrar questões</Button>
          </FiltersActions>

        </FiltersCard>

        <QuestionCountRow>
          <QuestionCounter>
            {countLabel}
            {!isSubscriber && !questionsCountLoading &&
              ` • ${5 - questionsAnswered} questões restantes (gratuitas)`}
          </QuestionCounter>
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
        </QuestionCountRow>

        {questionsLoading ? (
          <Card>Carregando questões...</Card>
        ) : questionsError ? (
          <Card>{questionsError}</Card>
        ) : responseFilterActive && userAnswersLoading ? (
          <Card>Carregando respostas...</Card>
        ) : responseFilteredQuestions.length === 0 ? (
          <Card>Nenhuma quest?o encontrada.</Card>
        ) : (
          responseFilteredQuestions.map((question, index) => {
            const isAnswered = answeredQuestions[question.id];
            const userAnswer = selectedAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const contestLabel = (() => {
              const yearLabel = question.year ? String(question.year) : '';
              if (!yearLabel) return question.contest;
              if (question.contest.includes(yearLabel)) return question.contest;
              if (question.contest === '-') return yearLabel;
              return `${question.contest} - ${yearLabel}`;
            })();

            const displayQuestionText =
              question.type === 'true-false'
                ? question.question.replace(/\n{2,}/g, '\n')
                : question.question;

            return (
              <QuestionItem
                key={question.id}
                $answered={isAnswered}
                $correct={isCorrect}
                $fontSize={fontSize}
              >
                <QuestionHeader>
                  <div className="question-info">
                    <div className="question-heading">
                      <span className="question-index">
                        {(currentPage - 1) * pageSize + index + 1}
                      </span>
                      {question.questionNumber !== '-' && (
                        <span className="question-code">{question.questionNumber}</span>
                      )}
                      {question.subject !== '-' && (
                        <span className="question-code">{question.subject}</span>
                      )}
                    </div>
                    <div className="question-detail">
                      <span>
                        <strong>Banca:</strong> {question.bank}
                      </span>
                      <span>
                        <strong>Concurso:</strong> {contestLabel}
                      </span>
                      <span>
                        <strong>Assunto:</strong> {question.subject}
                      </span>
                    </div>
                  </div>
                </QuestionHeader>

                <QuestionText $fontSize={fontSize}>
                  {displayQuestionText}
                </QuestionText>
                <div style={{ height: 4 }} />

                {question.type === 'multiple' && question.options && (
                  <OptionsContainer>
                    {question.options.map((option, optionIndex) => {
                      const letter = String.fromCharCode(97 + optionIndex);
                      const isSelected = selectedAnswers[question.id] === letter;
                      const isStriked = strikedOptions[question.id]?.includes(optionIndex);
                      const isCorrectOption = isAnswered && question.correctAnswer === letter;
                      const isIncorrectOption = isAnswered && isSelected &&
                        question.correctAnswer !== letter;

                      return (
                        <Option
                          key={optionIndex}
                          $selected={isSelected}
                          $correct={isCorrectOption}
                          $incorrect={isIncorrectOption}
                          $striked={isStriked}
                          $fontSize={fontSize}
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

                {question.type === 'true-false' && (
                  <OptionsContainer $isTrueFalse={true}>
                    {['certo', 'errado'].map((answer) => {
                      const label = answer.charAt(0).toUpperCase() + answer.slice(1);
                      const isSelected = selectedAnswers[question.id] === answer;
                      const isCorrectOption = isAnswered && question.correctAnswer === answer;
                      const isIncorrectOption = isAnswered && isSelected &&
                        question.correctAnswer !== answer;

                      return (
                        <Option
                          key={answer}
                          $selected={isSelected}
                          $correct={isCorrectOption}
                          $incorrect={isIncorrectOption}
                          $striked={false}
                          $fontSize={fontSize}
                          $isTrueFalse={true}
                          onClick={() => !isAnswered && handleAnswerSelect(question.id, answer)}
                        >
                          <div className="option-text">{label}</div>
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
                      ? question.type === 'true-false'
                        ? question.correctAnswer.charAt(0).toUpperCase() + question.correctAnswer.slice(1)
                        : question.correctAnswer.toUpperCase()
                      : 'Não informado'}
                  </div>
                )}

                <QuestionTabs>
                  {questionTabs.map(tab => (
                    <QuestionTab
                      key={tab.id}
                      $active={activeQuestionTab === tab.id}
                      onClick={() => setActiveQuestionTab(tab.id)}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </QuestionTab>
                  ))}
                </QuestionTabs>

                {questionTabs.map(tab => (
                  <TabContent key={tab.id} $active={activeQuestionTab === tab.id} $fontSize={fontSize}>
                    {tab.id === 'explanation' && (
                      <div>
                        {!isSubscriber ? (
                          <div>
                            <p>Conteúdo exclusivo para assinantes</p>
                            <Button onClick={() => setShowUpgradeModal(true)}>
                              Fazer upgrade
                            </Button>
                          </div>
                        ) : isAnswered ? (
                          <div>
                            <strong>Gabarito:</strong> {question.type === 'true-false' ? (question.correctAnswer.charAt(0).toUpperCase() + question.correctAnswer.slice(1)) : question.correctAnswer}<br />
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

        {!responseFilterActive && totalPages > 1 && (() => {
          const maxVisiblePages = 5;
          const halfRange = Math.floor(maxVisiblePages / 2);
          let startPage = Math.max(1, currentPage - halfRange);
          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }
          const pages = Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
          );

          return (
            <PaginationContainer>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                {pages.map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? undefined : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
              <PaginationInfo>
                Página {currentPage} de {totalPages}
              </PaginationInfo>
            </PaginationContainer>
          );
        })()}
      </React.Fragment>
    );
  };
  const renderDiscursiveQuestions = () => (
    <>

      <QuestionCounter>
        {mockDiscursiveQuestions.length} questões encontradas
      </QuestionCounter>

      {mockDiscursiveQuestions.map((question, index) => (
        <QuestionItem key={question.id} $fontSize={fontSize}>
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

          <QuestionText $fontSize={fontSize}>
            <strong>Questão {index + 1}:</strong> {question.question}
          </QuestionText>

          <DiscursiveAnswer 
            $fontSize={fontSize}
            placeholder="Digite sua resposta (mínimo 10 caracteres)..."
            minLength={10}
          />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Button>Enviar Resposta</Button>
            <Button variant="outline">Reenviar</Button>
            <Button variant="outline">Correção por IA</Button>
          </div>

          <TabContent $active={true} $fontSize={fontSize}>
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
            onChange={(e) => handleSimulationDisciplineChange(e.target.value)}
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
            <div className="exam-meta">20 questões • Tempo estimado: 40 min</div>
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
            <div className="exam-meta">15 questões • Tempo estimado: 30 min</div>
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
        <div className="stat-label">Total de Questões</div>
      </StatCard>
      <StatCard>
        <div className="stat-number">{performanceSummary.accuracyPercentage}%</div>
        <div className="stat-label">Percentual de Acertos</div>
      </StatCard>
      <StatCard>
        <div className="stat-number">{performanceSummary.correctAnswers}</div>
        <div className="stat-label">Questões Corretas</div>
      </StatCard>
      <StatCard>
        <div className="stat-number">{performanceSummary.incorrectAnswers}</div>
        <div className="stat-label">Questões Erradas</div>
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
                  `${value} questões (${pieData.find(item => item.name === name)?.percentage}%)`,
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
            $active={activeTab === tab.id}
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







