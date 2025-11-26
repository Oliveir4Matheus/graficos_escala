# 🚀 Quick Start - Terminal Note

Guia rápido para começar em **3 minutos**!

## Passo 1: Configurar Credenciais (1 min)

Execute o script de setup:
```bash
./setup.sh
```

Isso criará o arquivo `env.js`. Agora edite-o:
```bash
nano env.js
# ou
vim env.js
# ou abra com seu editor favorito
```

Cole sua chave do Supabase onde está `YOUR_SUPABASE_ANON_KEY_HERE`.

**Onde encontrar a chave?**
👉 https://app.supabase.com/project/yuixpaydnmrdeywlstdn/settings/api

Copie a **anon/public key**.

## Passo 2: Criar Tabela no Supabase (1 min)

1. Acesse: https://app.supabase.com/project/yuixpaydnmrdeywlstdn/sql/new
2. Cole este SQL:

```sql
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo publicamente"
ON notes FOR ALL TO public
USING (true) WITH CHECK (true);
```

3. Clique em **RUN**

## Passo 3: Testar Localmente (1 min)

Inicie um servidor local:
```bash
python3 -m http.server 8000
```

Abra no navegador:
```
http://localhost:8000
```

✅ **Pronto!** Você já pode criar suas notas!

---

## 📦 Bonus: Deploy no Netlify (2 min)

### Opção Rápida: Netlify Drop

1. Abra: https://app.netlify.com/drop
2. Arraste **TODOS** os arquivos do projeto (incluindo env.js)
3. ✅ Seu site estará online!

### Opção Git (Recomendada)

1. Conecte seu repositório no Netlify
2. No Netlify, vá em **Site settings** → **Build & deploy** → **Snippet injection**
3. Adicione este código no `<head>`:

```html
<script>
window.ENV = {
    SUPABASE_URL: 'https://yuixpaydnmrdeywlstdn.supabase.co',
    SUPABASE_ANON_KEY: 'SUA_CHAVE_AQUI'
};
</script>
```

4. ✅ Deploy!

---

## ❓ Problemas?

### Erro: "Configure as credenciais do Supabase primeiro!"
- Certifique-se que criou o arquivo `env.js`
- Verifique se colou a chave correta (sem aspas extras)
- Recarregue a página (F5)

### Erro ao salvar nota
- Certifique-se que criou a tabela no Supabase
- Verifique se a chave está correta
- Abra o Console do navegador (F12) para ver erros

### Erro CORS ainda aparece
- Certifique-se que está usando o cliente Supabase (já configurado)
- Não modifique o app.js sem entender o código
- Veja CORS_SETUP.md para mais detalhes

---

## 📚 Mais Informações

- **README.md** - Documentação completa
- **CORS_SETUP.md** - Detalhes sobre o erro CORS e como foi resolvido
- **env.template.js** - Template de configuração

---

**Dúvidas?** Abra uma issue no repositório!
