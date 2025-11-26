#!/bin/bash

# Script de configuração para Terminal Note
# Este script copia o .env.example e gera o env.js

echo "🚀 Terminal Note - Setup"
echo "======================="
echo ""

# Verificar se .env já existe
if [ -f ".env" ]; then
    echo "⚠️  O arquivo .env já existe!"
    read -p "Deseja sobrescrevê-lo? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Setup cancelado."
        exit 0
    fi
fi

# Copiar .env.example para .env
echo "📋 Copiando .env.example para .env..."
cp .env.example .env

if [ $? -eq 0 ]; then
    echo "✅ Arquivo .env criado com sucesso!"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. Acesse: https://app.supabase.com/project/yuixpaydnmrdeywlstdn/settings/api"
    echo "2. Copie sua 'anon/public key'"
    echo "3. Edite o arquivo .env e cole sua chave"
    echo "4. Execute: npm run build (ou node build.js)"
    echo "5. Abra index.html no navegador"
    echo ""
    echo "💡 Para editar o arquivo:"
    echo "   - Linux/Mac: nano .env ou vim .env"
    echo "   - Windows: notepad .env"
    echo ""
else
    echo "❌ Erro ao criar .env"
    exit 1
fi
