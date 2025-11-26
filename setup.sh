#!/bin/bash

# Script de configuração para Terminal Note
# Este script copia o template e ajuda você a configurar suas credenciais

echo "🚀 Terminal Note - Setup"
echo "======================="
echo ""

# Verificar se env.js já existe
if [ -f "env.js" ]; then
    echo "⚠️  O arquivo env.js já existe!"
    read -p "Deseja sobrescrevê-lo? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Setup cancelado."
        exit 0
    fi
fi

# Copiar template
echo "📋 Copiando env.template.js para env.js..."
cp env.template.js env.js

if [ $? -eq 0 ]; then
    echo "✅ Arquivo env.js criado com sucesso!"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. Acesse: https://app.supabase.com/project/yuixpaydnmrdeywlstdn/settings/api"
    echo "2. Copie sua 'anon/public key'"
    echo "3. Edite o arquivo env.js e cole sua chave"
    echo "4. Abra index.html no navegador"
    echo ""
    echo "💡 Para abrir o arquivo:"
    echo "   - Linux/Mac: nano env.js ou vim env.js"
    echo "   - Windows: notepad env.js"
    echo ""
else
    echo "❌ Erro ao criar env.js"
    exit 1
fi
