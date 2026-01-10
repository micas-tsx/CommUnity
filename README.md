# 🏘️ CommUnity

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> **Plataforma de economia colaborativa que conecta vizinhos para trocas de favores, ofertas e pedidos de ajuda.** Transforme seu condomínio ou comunidade em uma rede de apoio mútuo, onde todos podem oferecer e receber ajuda de forma simples e segura.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Diferencial de UX](#-diferencial-de-ux)
- [Configuração Local](#-configuração-local)
- [Layout e Interface](#-layout-e-interface)
- [Estrutura do Projeto](#-estrutura-do-projeto)

---

## ✨ Funcionalidades

### 🔐 Autenticação e Perfil Completo
- **Cadastro "All-in-One"**: Registro de usuário e criação de perfil em uma única etapa
- **Login seguro** com Supabase Authentication
- **Perfil completo** com nome, telefone e informações de apartamento/bloco
- **Gerenciamento de dados pessoais** diretamente no perfil

### 📢 Sistema de Anúncios
- **Criação de anúncios** com título, descrição, categoria e tipo
- **Tipos de anúncios**:
  - 🟢 **Oferta**: Usuário oferece ajuda/serviço
  - 🔵 **Pedido**: Usuário solicita ajuda/serviço
- **Categorias disponíveis**:
  - Favores em geral
  - Tecnologia
  - Educação
  - Manutenção
- **Listagem dinâmica** de todos os anúncios ordenados por data (mais recentes primeiro)

### 📱 Detalhes e Integração WhatsApp
- **Página de detalhes** completa para cada anúncio
- **Informações do morador** (nome, apartamento, telefone)
- **Integração direta com WhatsApp** via link pré-formatado
- **Mensagem automática** personalizada ao entrar em contato

### 👤 Gerenciamento de Anúncios
- **Visualização de seus próprios anúncios** na página de perfil
- **Exclusão de anúncios** com confirmação de segurança
- **Controle total** sobre seus publicações

---

## 🛠️ Tecnologias

### Frontend
- **[Next.js 16.1.1](https://nextjs.org/)** - Framework React com App Router
- **[React 19.2.3](https://react.dev/)** - Biblioteca JavaScript para interfaces
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first

### Backend e Banco de Dados
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - Authentication para gerenciamento de usuários
  - PostgreSQL como banco de dados
  - Row Level Security (RLS) para segurança de dados
  - APIs REST e Realtime automáticas

### Bibliotecas e Ferramentas
- **[Lucide React](https://lucide.dev/)** - Ícones modernos e leves
- **[React Hot Toast](https://react-hot-toast.com/)** - Notificações elegantes
- **[@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)** - Integração SSR do Supabase

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para qualidade de código
- **PostCSS** - Processador CSS

---

## 🎨 Diferencial de UX

### 🚀 Fluxo de Registro "All-in-One"
O CommUnity oferece uma experiência única no momento do cadastro: **autenticação e criação de perfil acontecem simultaneamente em uma única tela**. Isso significa que o usuário não precisa passar por múltiplas etapas para começar a usar a plataforma. O processo é:
1. Preencher dados de login (email e senha)
2. Completar informações do perfil (nome, telefone, apartamento)
3. Tudo isso em **uma única ação**

### 🔒 Segurança Baseada em RLS (Row Level Security)
A segurança dos dados é garantida através das políticas **Row Level Security (RLS)** do Supabase. Isso significa que:
- Cada usuário só acessa seus próprios dados de perfil
- Apenas o criador de um anúncio pode editá-lo ou excluí-lo
- As consultas ao banco são automaticamente filtradas por permissões
- Zero configuração adicional de segurança no frontend

### 💬 Integração Nativa com WhatsApp
A comunicação entre vizinhos é facilitada através de integração direta com WhatsApp:
- Link gerado automaticamente com número formatado
- Mensagem pré-configurada incluindo referência ao CommUnity
- Abertura direta no aplicativo WhatsApp (mobile) ou web

---

## ⚙️ Configuração Local

### Pré-requisitos
- **Node.js** 18.x ou superior
- **npm** ou **yarn** como gerenciador de pacotes
- Conta no **Supabase** (gratuita)
- Conta no **GitHub** (opcional, para clonar o repositório)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/community.git
   cd community
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
   
   > 📝 **Onde encontrar essas variáveis?**
   > 1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com/)
   > 2. Vá em **Settings** → **API**
   > 3. Copie a **URL** do projeto e a chave **anon/public**

4. **Configure o banco de dados no Supabase**
   
   Você precisará criar as seguintes tabelas no Supabase:
   
   **Tabela `profiles`:**
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     full_name TEXT,
     apartment_block TEXT,
     phone TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );
   ```
   
   **Tabela `favors`:**
   ```sql
   CREATE TABLE favors (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users NOT NULL,
     user_name TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     category TEXT NOT NULL,
     type TEXT CHECK (type IN ('OFFER', 'REQUEST')) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );
   ```
   
   **Políticas RLS para `profiles`:**
   ```sql
   -- Habilitar RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Permitir leitura pública
   CREATE POLICY "Perfis são públicos para leitura"
     ON profiles FOR SELECT
     USING (true);
   
   -- Permitir que usuários atualizem apenas seu próprio perfil
   CREATE POLICY "Usuários podem atualizar seu próprio perfil"
     ON profiles FOR UPDATE
     USING (auth.uid() = id);
   
   -- Permitir que usuários insiram seu próprio perfil
   CREATE POLICY "Usuários podem inserir seu próprio perfil"
     ON profiles FOR INSERT
     WITH CHECK (auth.uid() = id);
   ```
   
   **Políticas RLS para `favors`:**
   ```sql
   -- Habilitar RLS
   ALTER TABLE favors ENABLE ROW LEVEL SECURITY;
   
   -- Permitir leitura pública
   CREATE POLICY "Favores são públicos para leitura"
     ON favors FOR SELECT
     USING (true);
   
   -- Permitir que usuários criem seus próprios favores
   CREATE POLICY "Usuários podem criar favores"
     ON favors FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   
   -- Permitir que usuários excluam apenas seus próprios favores
   CREATE POLICY "Usuários podem excluir seus próprios favores"
     ON favors FOR DELETE
     USING (auth.uid() = user_id);
   ```

5. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint
```

---

## 🖼️ Layout e Interface

### 📸 Screenshots

_Em breve: capturas de tela das principais telas do projeto serão adicionadas aqui._

<!-- 
#### Tela Inicial
![Home](./docs/screenshots/home.png)

#### Página de Detalhes
![Favor Details](./docs/screenshots/favor-details.png)

#### Perfil do Usuário
![Profile](./docs/screenshots/profile.png)

#### Criação de Anúncio
![Create Favor](./docs/screenshots/create-favor.png)
-->

### 🎨 Design System

O projeto utiliza **Tailwind CSS** com um design system consistente:
- **Cores principais**: Configuradas via classes `bg-brand` e `bg-brand-dark`
- **Responsividade**: Mobile-first com breakpoints padrão do Tailwind
- **Componentes reutilizáveis**: Cards, formulários e botões padronizados

---

## 📁 Estrutura do Projeto

```
CommUnity/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── (site)/            # Grupo de rotas
│   │   │   ├── (auth)/        # Rotas de autenticação
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── create-favor/  # Criação de anúncios
│   │   │   ├── favor/[id]/    # Detalhes dinâmicos
│   │   │   └── perfil/        # Perfil do usuário
│   │   ├── globals.css        # Estilos globais
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página inicial
│   ├── components/            # Componentes React
│   │   ├── FavorCards.tsx     # Card de anúncio
│   │   ├── FavorsPerfil.tsx   # Card para perfil
│   │   └── Header.tsx         # Cabeçalho da aplicação
│   ├── contexts/              # Contextos React
│   │   └── AuthContext.tsx    # Contexto de autenticação
│   ├── libs/                  # Bibliotecas e utilitários
│   │   └── supabase.ts        # Cliente Supabase
│   └── types/                 # Definições TypeScript
│       └── Favors.ts          # Tipos de favores
├── .env.local                 # Variáveis de ambiente (não versionado)
├── eslint.config.mjs          # Configuração ESLint
├── next.config.ts             # Configuração Next.js
├── package.json               # Dependências do projeto
├── postcss.config.mjs         # Configuração PostCSS
├── tailwind.config.ts         # Configuração Tailwind CSS
└── tsconfig.json              # Configuração TypeScript
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Este projeto visa criar uma comunidade mais conectada e colaborativa. Se você tem ideias, correções ou melhorias, fique à vontade para abrir issues ou pull requests.

---

## 💡 Ideias Futuras

- 🔔 Sistema de notificações em tempo real
- ⭐ Sistema de avaliações e recomendações
- 📍 Filtros avançados por categoria e tipo
- 🔍 Busca de anúncios
- 💬 Chat integrado na plataforma
- 📊 Dashboard com estatísticas de ajuda mútua

---

<div align="center">

**Feito com ❤️ para conectar comunidades**

[Reportar Bug](https://github.com/micas-tsx/community/issues) · [Solicitar Funcionalidade](https://github.com/micas-tsx/community/issues)

</div>
