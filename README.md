# Terminal Note - Aplicação de Notas

Aplicação simples de notas usando Supabase com correção para erro CORS.

## 🚀 Quick Start

### 1. Configurar Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com/project/yuixpaydnmrdeywlstdn/settings/api)
2. Copie sua **anon/public key**
3. Edite o arquivo `app.js` e substitua:
   ```javascript
   const SUPABASE_ANON_KEY = 'SUA_CHAVE_AQUI';
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

```bash
# Servir arquivos
python3 -m http.server 8000

# Ou usar npx serve
npx serve .
```

Acesse: http://localhost:8000

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
