#!/usr/bin/env node

// Script para gerar env.js a partir do .env
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const outputPath = path.join(__dirname, 'env.js');

// Ler arquivo .env
if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env não encontrado!');
    console.log('📝 Copie .env.example para .env e configure suas credenciais.');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse do .env
envContent.split('\n').forEach(line => {
    line = line.trim();
    // Ignorar comentários e linhas vazias
    if (!line || line.startsWith('#')) return;

    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();

    if (key && value) {
        envVars[key.trim()] = value;
    }
});

// Validar credenciais
if (!envVars.SUPABASE_ANON_KEY || envVars.SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
    console.error('❌ Configure o SUPABASE_ANON_KEY no arquivo .env!');
    process.exit(1);
}

// Gerar env.js
const envJs = `// Gerado automaticamente a partir do .env
// NÃO edite este arquivo manualmente! Edite o .env e execute npm run build

window.ENV = {
    SUPABASE_URL: '${envVars.SUPABASE_URL || 'https://yuixpaydnmrdeywlstdn.supabase.co'}',
    SUPABASE_ANON_KEY: '${envVars.SUPABASE_ANON_KEY}'
};
`;

fs.writeFileSync(outputPath, envJs);
console.log('✅ env.js gerado com sucesso a partir do .env!');
