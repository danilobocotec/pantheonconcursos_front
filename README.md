# pantheonconcursos_front

## Area administrativa (Meus cursos)

- Removido menu de Vade Mecum do admin e excluido o modulo correspondente.
- Questões admin: adicionados campos de alternativas e resposta correta + paginacao.
- Autenticacao via `pantheon:token` obrigatoria em todas as chamadas de "Meus cursos"
  com redirecionamento para login quando ausente.

### Categorias

- Caixa "Categorias" com listagem, edicao e remocao (popup de confirmacao).
- Cadastro e edicao em modal.
- Upload de imagem via drag-and-drop (base64).
- Vinculo de cursos por seletor (com modal de insercao).
- Endpoints:
  - `GET /api/v1/cursos/categorias`
  - `POST /api/v1/cursos/categorias`
  - `PUT /api/v1/cursos/categorias/:id`
  - `DELETE /api/v1/cursos/categorias/:id`

### Cursos

- Caixa "Cursos" com listagem e acoes de editar/remover.
- Cadastro/edicao em modal:
  - Nome completo
  - Categoria
  - Imagem (base64)
  - Modulos
- Vinculo de categoria inline na listagem (PUT automatico).
- Endpoints:
  - `GET /api/v1/cursos`
  - `POST /api/v1/cursos`
  - `PUT /api/v1/cursos/:id`
  - `DELETE /api/v1/cursos/:id`

### Modulos

- Caixa "Modulo" com listagem e acoes de editar/remover.
- Cadastro/edicao em modal.
- Insercao de atividades via modal com busca.
- Ordenacao e remocao de atividades dentro do modulo (prioridade salva).
- Endpoints:
  - `GET /api/v1/meus-cursos/modulos`
  - `POST /api/v1/meus-cursos/modulos`
  - `PUT /api/v1/meus-cursos/modulos/:id`
  - `DELETE /api/v1/meus-cursos/modulos/:id`

### Itens

- Caixa "Itens" com listagem e edicao em modal.
- Campos: titulo, tipo (Livro/Video), conteudo.
- Editor rich text (TipTap) com:
  - Formatacao: negrito, italico, alinhamento
  - Tamanho e tipo de fonte
  - Listas (marcadores e numeradas)
  - Insercao de imagens, videos e links de audio
- Modulo nao obrigatorio.
- Remocao com confirmacao.
- Endpoints:
  - `GET /api/v1/meus-cursos/itens`
  - `POST /api/v1/meus-cursos/itens`
  - `PUT /api/v1/meus-cursos/itens/:id`
  - `DELETE /api/v1/meus-cursos/itens/:id`

## Area do Usuario (Meus Cursos)

### Visualizacao de Cursos

- Abas "OAB 1ª Fase" e "OAB 2ª Fase" com filtro por categoria
- Listagem hierarquica: Cursos > Modulos > Itens
- Barra de progresso para cursos e modulos
- Indicadores de conclusao de atividades
- Sistema de progresso salvo em localStorage (`pantheon:completed-items`)
- Autenticacao via Bearer token (`pantheon:token`)
- Redirect automatico para login se nao autenticado ou sessao expirada
- Endpoints utilizados:
  - `GET /api/v1/cursos/categorias`
  - `GET /api/v1/meus-cursos/modulos`
  - `GET /api/v1/meus-cursos/itens`

### Visualizacao de Conteudo

- Pagina full-screen para leitura de conteudo
- Sidebar lateral com lista de atividades do modulo
- Navegacao sequencial entre itens (Anterior/Proximo)
- Breadcrumb para orientacao (Curso > Modulo > Item)
- Botao de conclusao de item com atualizacao de progresso em tempo real
- Renderizacao de HTML com suporte a:
  - Formatacao de texto (negrito, italico, alinhamento)
  - Diferentes tamanhos e tipos de fonte
  - Listas (marcadores e numeradas)
  - Imagens responsivas
  - Videos incorporados
  - Links de audio
- Layout responsivo com sidebar colapsavel em mobile

## Autenticacao

### Sistema de Autenticacao

- Token armazenado em `localStorage` como `pantheon:token`
- Header `Authorization: Bearer {token}` em todas as requisicoes autenticadas
- Deteccao automatica de sessao expirada (status 401/403)
- Limpeza de tokens em caso de erro de autenticacao
- Redirect automatico para login com mensagem ao usuario

### Utility de Autenticacao (src/lib/auth.ts)

Funcoes disponiveis:
- `isAuthenticated()` - Verifica se ha token valido
- `getAuthToken()` - Obtem token do localStorage
- `clearAuthToken()` - Remove token e dados do usuario
- `authenticatedGet(url)` - Requisicao GET autenticada
- `authenticatedPost(url, data)` - Requisicao POST autenticada
- `authenticatedPut(url, data)` - Requisicao PUT autenticada
- `authenticatedDelete(url)` - Requisicao DELETE autenticada

Exemplo de uso:
```typescript
import { authenticatedGet } from '@/lib/auth';

try {
  const data = await authenticatedGet('/cursos');
} catch (err) {
  if (err.message === 'Sessao expirada') {
    // Redirect para login
  }
}
```

## Configuracao de API

Base URL: `http://localhost:8080/api/v1` (configuravel via `VITE_API_BASE_URL`)

Todas as rotas sao automaticamente prefixadas pela funcao `buildApiUrl()`:
```typescript
// Exemplo:
buildApiUrl('/cursos') → 'http://localhost:8080/api/v1/cursos'
```
