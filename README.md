# Encurtador de URLs

## Demo (deploys)
- Back-end (Render): sorry 
- Front-end (Vercel/Netlify): Eduardo.  

O projeto neste repositório é um encurtador de URLs com interface React + Vite e chamadas a uma API (back-end). Ele permite criar, copiar, editar e excluir links, além de mostrar contagem de cliques e data de criação.

## Principais arquivos e componentes
- [package.json](package.json)  
- [vite.config.js](vite.config.js)  
- [index.html](index.html)  
- [src/App.jsx](src/App.jsx) — componente de topo (`App`)  
- [src/main.jsx](src/main.jsx) — bootstrap da aplicação (`main`)  
- [src/pages/Home.jsx](src/pages/Home.jsx) — página principal (`Home`)  
- [src/components/gerarLink.jsx](src/components/gerarLink.jsx) — componente de criação de links (`gerarLink`)  
- [src/components/meusLinks.jsx](src/components/meusLinks.jsx) — lista e controles dos links (`MeusLinks`)  
  - Funções internas relevantes: [`copiarParaAreaTransferencia`](src/components/meusLinks.jsx), [`salvarEdicao`](src/components/meusLinks.jsx), [`confirmarExcluir`](src/components/meusLinks.jsx)  
- [src/lib/api.js](src/lib/api.js) — funções para comunicação com a API (`api`)  
- [src/index.css](src/index.css)  
- [src/assets/](src/assets)  
- [public/](public)  
- Configs: [.env](.env), [.gitignore](.gitignore), [eslint.config.js](eslint.config.js), [postcss.config.js](postcss.config.js), [tailwind.config.js](tailwind.config.js)

## O que é o projeto
Este projeto implementa um encurtador de URLs com UI para:
- Criar um link encurtado.
- Copiar link encurtado para área de transferência.
- Editar legenda e URL inline.
- Excluir links com confirmação.
- Exibir número de cliques e data de criação.

## Instalação e execução local

1. Pré-requisitos
   - Node.js >= 16
   - npm ou yarn
   - Um banco de dados (ex.: PostgreSQL) compatível com o back-end (ver docs do repositório do back-end).

2. Clonar e instalar
```sh
git clone https://github.com/Dudxxx/frontend_encurtador
npm install
```


3. Variáveis de ambiente
- Crie um arquivo .env na raiz (ou configure via ambiente) com pelo menos:
VITE_API_URL=https://seu-backend.onrender.com/api

- OUTRAS_VARS_DO_BACKEND (conforme o back-end exige)
O front espera uma variável pública tipo VITE_API_URL para apontar para a API. A comunicação com a API é realizada por funções em src/lib/api.js.

4. Banco de dados / Back-end
Suba o back-end (em Render, Heroku, ou localmente). Siga as instruções do repositório do back-end para migrar/criar o banco e configurar variáveis (ex.: DATABASE_URL, JWT_SECRET).

Aponte VITE_API_URL para a URL do back-end.

5. Rodar em modo desenvolvimento

```bash
npm run dev
```

Abra http://localhost:5173 (ou a porta que o Vite indicar).


### Scripts úteis (em package.json)

- npm run dev — inicia o servidor de desenvolvimento
= npm run build — build de produção
= npm run preview — preview do build

Funcionalidade Extra (implementações e justificativa)

- Copiar com feedback visual: função copiarParaAreaTransferencia exibe um toast temporário "Copiado!" para melhorar a experiência do usuário ao copiar o link.

- Edição inline: componente MeusLinks permite editar legenda e url inline com validação mínima (salvarEdicao), evitando navegação para outra tela e agilizando correções.

- Confirmação de exclusão: confirmarExcluir solicita confirmação via window.confirm antes de chamar o back-end, prevenindo exclusões acidentais.

- Contagem de cliques e data formatada: a UI mostra cliques (campo clicks) e formata a data (createdAt) para pt-BR, oferecendo feedback analítico simples.

- Acessibilidade e responsividade: botões alternam entre ícones e texto conforme o tamanho da tela para melhorar usabilidade em mobile/desktop.
