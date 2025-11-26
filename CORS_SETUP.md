# Solução para Erro CORS com Supabase

## 🔴 Problema Identificado

```
Access to fetch at 'https://yuixpaydnmrdeywlstdn.supabase.co/notes'
from origin 'https://terminalnote.netlify.app' has been blocked by CORS policy
```

## ✅ Soluções Implementadas

### 1. **Usar o Cliente Oficial do Supabase (Recomendado)**

O erro ocorre porque você está fazendo requisições `fetch()` diretamente para as URLs do Supabase.

**❌ ERRADO (Causa CORS):**
```javascript
fetch('https://yuixpaydnmrdeywlstdn.supabase.co/notes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({content: 'minha nota'})
})
```

**✅ CORRETO (Sem CORS):**
```javascript
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { data, error } = await supabase
    .from('notes')
    .insert([{content: 'minha nota'}]);
```

### 2. **Configuração no Supabase Dashboard**

1. Acesse: https://app.supabase.com/project/yuixpaydnmrdeywlstdn
2. Vá em **Settings** → **API**
3. Em **API Settings**, adicione sua URL do Netlify nas **Allowed origins**:
   - `https://terminalnote.netlify.app`
   - `http://localhost:3000` (para desenvolvimento)
   - `http://127.0.0.1:3000` (para desenvolvimento)

### 3. **Configurar suas Credenciais**

**Método Rápido:**
```bash
./setup.sh
```

**Método Manual:**
1. Copie o template:
   ```bash
   cp env.template.js env.js
   ```
2. Acesse: https://app.supabase.com/project/yuixpaydnmrdeywlstdn/settings/api
3. Copie a **anon/public key**
4. Edite `env.js` e cole sua chave:
   ```javascript
   window.ENV = {
       SUPABASE_URL: 'https://yuixpaydnmrdeywlstdn.supabase.co',
       SUPABASE_ANON_KEY: 'cole-sua-chave-aqui'
   };
   ```

**IMPORTANTE:** O arquivo `env.js` está no `.gitignore` e não será commitado por segurança.

### 4. **Criar a Tabela no Supabase**

Execute este SQL no SQL Editor do Supabase:

```sql
-- Criar tabela notes
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública"
ON notes FOR SELECT
TO public
USING (true);

-- Política para permitir inserção pública
CREATE POLICY "Permitir inserção pública"
ON notes FOR INSERT
TO public
WITH CHECK (true);

-- Política para permitir atualização pública
CREATE POLICY "Permitir atualização pública"
ON notes FOR UPDATE
TO public
USING (true);

-- Política para permitir exclusão pública
CREATE POLICY "Permitir exclusão pública"
ON notes FOR DELETE
TO public
USING (true);
```

## 📦 Deploy no Netlify

### Opção 1: Deploy Manual
1. Arraste os arquivos para o Netlify Drop
2. Configure as variáveis de ambiente (veja abaixo)

### Opção 2: Deploy via Git (Recomendado)
1. Commit e push dos arquivos:
   ```bash
   git add .
   git commit -m "Fix CORS issue with Supabase"
   git push
   ```

2. Conecte o repositório no Netlify:
   - Build command: (deixe vazio para site estático)
   - Publish directory: `.`

### Configurar Variáveis de Ambiente no Netlify

Como o arquivo `env.js` não é commitado (está no .gitignore), você precisa criar ele manualmente no servidor ou usar um build script.

**Opção A: Criar env.js no servidor**
1. No Netlify, vá em **Site settings** → **Build & deploy** → **Post processing** → **Snippet injection**
2. Adicione este snippet no `<head>`:
```html
<script>
window.ENV = {
    SUPABASE_URL: 'https://yuixpaydnmrdeywlstdn.supabase.co',
    SUPABASE_ANON_KEY: 'SUA_CHAVE_AQUI'
};
</script>
```

**Opção B: Criar env.js manualmente**
1. Depois do deploy, vá no dashboard do Netlify
2. **Deploys** → **Deploy settings** → **Trigger deploy** → **Deploy site**
3. Ou adicione o arquivo `env.js` diretamente no repositório para produção (não recomendado para chaves sensíveis)

**Opção C: Usar variáveis de ambiente do Netlify (Avançado)**
Requer um build step com um script que gera o env.js a partir das variáveis de ambiente.

## 🔒 Segurança (Opcional)

Para produção, considere:

1. **Usar variáveis de ambiente:**
   ```javascript
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
   const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```

2. **Configurar RLS (Row Level Security)** adequadamente no Supabase

3. **Implementar autenticação** se necessário

## 🧪 Testar Localmente

```bash
# Servir os arquivos localmente
python3 -m http.server 8000
# ou
npx serve .
```

Acesse: http://localhost:8000

## 📚 Recursos Úteis

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [CORS no Supabase](https://supabase.com/docs/guides/api/cors)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
