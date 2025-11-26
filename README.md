# Terminal Note - Aplicação de Notas

Aplicação simples de notas usando Supabase com correção para erro CORS.

## 🚀 Quick Start

### 1. Configurar Credenciais (.env)

**Opção A: Usando o script de setup (Recomendado)**
```bash
./setup.sh
```
Depois edite o arquivo `.env` com sua chave do Supabase.

**Opção B: Manual**
1. Copie o arquivo .env.example:
   ```bash
   cp .env.example .env
   ```
2. Acesse o [Supabase Dashboard](https://app.supabase.com/project/yuixpaydnmrdeywlstdn/settings/api)
3. Copie sua **anon/public key**
4. Edite o arquivo `.env` e cole sua chave:
   ```env
   SUPABASE_URL=https://yuixpaydnmrdeywlstdn.supabase.co
   SUPABASE_ANON_KEY=sua-chave-aqui
   ```
5. Gere o env.js:
   ```bash
   npm run build
   # ou
   node build.js
   ```

### 2. Criar Tabela no Supabase

Execute no SQL Editor:

```sql
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo publicamente"
ON notes FOR ALL
TO public
USING (true)
WITH CHECK (true);
```

### 3. Configurar CORS no Supabase

1. Vá em **Settings** → **API**
2. Adicione em **Allowed origins**:
   - `https://terminalnote.netlify.app`
   - `http://localhost:8000`

### 4. Deploy no Netlify

**Opção A: Deploy Manual**
- Arraste os arquivos para o Netlify Drop

**Opção B: Via Git**
```bash
git add .
git commit -m "Fix CORS issue"
git push
```
- Conecte o repositório no Netlify

## 🔧 Desenvolvimento Local

**Primeiro, configure suas credenciais:**
```bash
# Método rápido
./setup.sh
# Edite o .env com sua chave
# Execute: npm run build

# Ou manualmente
cp .env.example .env
# Edite .env com sua chave
npm run build
```

**Depois, inicie o servidor local:**
```bash
# Opção 1: Build + Python (Recomendado)
npm run dev

# Opção 2: Build + Node.js
npm run serve

# Opção 3: Manual
npm run build && python3 -m http.server 8000
```

Acesse: http://localhost:8000

**Importante:** Não esqueça de criar a tabela no Supabase antes de usar!

## ❌ Erro CORS - O que estava errado?

**Problema:** Fazer `fetch()` direto para URLs do Supabase causa CORS.

**Solução:** Usar o cliente oficial `@supabase/supabase-js`.

Veja mais detalhes em [CORS_SETUP.md](CORS_SETUP.md)

## 📁 Estrutura

```
.
├── index.html          # Interface da aplicação
├── app.js             # Lógica com cliente Supabase
├── package.json       # Dependências (opcional)
├── netlify.toml       # Configuração Netlify
├── .env.example       # Exemplo de variáveis
├── CORS_SETUP.md      # Guia detalhado CORS
└── README.md          # Este arquivo
```

## 🛠️ Tecnologias

- HTML5
- JavaScript (Vanilla)
- [Supabase](https://supabase.com) - Backend as a Service
- [Netlify](https://netlify.com) - Hosting

## 📚 Documentação

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase CORS Guide](https://supabase.com/docs/guides/api/cors)
