# Área do Aluno com Sistema de Questões - MVP Implementation Plan

## Core Files to Create/Modify (Max 8 files limit)

### 1. **src/App.tsx** - Main app structure with routing
- Remove Tailwind dependencies and setup styled-components
- Setup main routes: /login, /dashboard, /courses, /mindmaps, /vademecum, /questions
- Theme provider for light/dark mode
- Authentication context

### 2. **src/styles/GlobalStyles.ts** - Global styles with styled-components
- Color palette: 60% #DEE1F2/#FFFFFF, 30% #771819/#db3026, 10% #111414
- Typography scales (3 font size levels)
- Dark/light theme definitions
- Responsive breakpoints

### 3. **src/components/Layout/Sidebar.tsx** - Main navigation sidebar
- Menu items: Meus Cursos, Vade Mecum, Mapas Mentais, Sistema de Questões
- Collapsible submenus with smooth transitions
- Icons and active states
- Responsive behavior

### 4. **src/pages/MeusCursos.tsx** - Course management page
- OAB 1ª Fase and OAB 2ª Fase sections
- Expandable discipline/module structure
- Progress bars and gamification elements
- Activity status tracking (completed/not completed)

### 5. **src/pages/SistemaQuestoes.tsx** - Questions system main page
- Tabs: Objetivas, Discursivas, Provas Comentadas, Simulados, Meu Desempenho
- Multiple filters (checkboxes for disciplines, subjects, etc.)
- Question counter and pagination
- Free trial limits (5 questions for non-subscribers)

### 6. **src/pages/MapasMentais.tsx** - Mind maps page
- Grid/list view toggle (Google Drive style)
- Discipline and theme filters
- Pagination with total count
- Responsive image gallery

### 7. **src/pages/VadeMecum.tsx** - Legal documents page
- Hierarchical navigation (titles → chapters → articles)
- Article search (accepts "1230" and "1.230" formats)
- Right sidebar with anchors
- Full text display with smooth scrolling

### 8. **src/components/ContentEditor/LessonContent.tsx** - Content rendering component
- HTML sanitization for Moodle/TinyMCE/C4L content
- Support for audio/video embeds
- C4L component styles (keyconcept, attention, tip, reminder, example)
- Responsive media handling

## Key Features Implementation Priority:

1. **Authentication & User Roles** (simplified mock for MVP)
2. **Sidebar Navigation** with smooth transitions
3. **Meus Cursos** with basic course structure
4. **Sistema de Questões** with objective questions and basic filtering
5. **Content rendering** with HTML support
6. **Responsive design** with styled-components
7. **Theme switching** (light/dark mode)
8. **Basic progress tracking** and gamification elements

## Technical Decisions for MVP:
- Use localStorage for user data/progress (no backend integration)
- Mock data for courses, questions, and content
- Simplified authentication (role selection)
- Basic HTML sanitization for content
- Essential filters only (can expand later)
- Focus on core user flows and visual design

## Color Palette Usage:
- Primary backgrounds: #DEE1F2 (light), #111414 (dark)
- Accent colors: #771819, #db3026
- Text and borders: #FFFFFF, #111414
- Success/error states: green/red with proper contrast

This MVP focuses on delivering a working prototype with the core functionality while staying within the 8-file limit and ensuring high success rate.