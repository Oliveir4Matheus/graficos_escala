# 📊 Visualização de Escala de Trabalho

Sistema de visualização de escala de trabalho com gráficos de linha mostrando a quantidade de pessoas trabalhando por dia do mês, organizado por função e departamento.

## 🎯 Funcionalidades

- **Gráfico de Linhas**: Visualização clara da quantidade de pessoas trabalhando em cada dia do mês
- **Linha de Tendência**: Cada função possui uma linha de tendência pontilhada para análise de padrões
- **Filtros Dinâmicos**:
  - Filtro por departamento (seleção única)
  - Filtro por função (seleção múltipla)
- **Estatísticas em Tempo Real**:
  - Média de pessoas por dia
  - Quantidade mínima
  - Quantidade máxima
  - Total de funcionários
- **Design Responsivo**: Adaptável a diferentes tamanhos de tela
- **Top 10 Funções**: Por padrão, mostra as 10 funções com mais pessoas

## 📁 Estrutura do Projeto

```
graficos_escala/
├── dados.xlsx          # Planilha original de escala
├── dados.json          # Dados processados em JSON
├── index.html          # Página principal
├── app.js              # Lógica JavaScript
└── README.md           # Esta documentação
```

## 🚀 Como Usar

### 1. Abrir a Aplicação

#### Opção A: Servidor HTTP com Python
```bash
cd /home/user/graficos_escala
python3 -m http.server 8000
```
Depois acesse: `http://localhost:8000`

#### Opção B: Servidor HTTP com Node.js
```bash
npx http-server -p 8000
```

#### Opção C: Abrir diretamente no navegador
Abra o arquivo `index.html` diretamente no seu navegador.

### 2. Usar os Filtros

1. **Filtrar por Departamento**: Selecione um departamento no dropdown superior
2. **Filtrar por Função**:
   - Use Ctrl/Cmd + Clique para selecionar múltiplas funções
   - Deixe vazio para ver as top 10 funções
3. **Aplicar Filtros**: Clique no botão "✓ Aplicar Filtros"
4. **Limpar Filtros**: Clique no botão "↺ Limpar Filtros"

### 3. Interagir com o Gráfico

- **Hover**: Passe o mouse sobre as linhas para ver detalhes
- **Legenda**: Clique nos itens da legenda para mostrar/ocultar funções
- **Zoom**: Use a roda do mouse (se habilitado)

## 📊 Como os Dados São Processados

### Lógica de Trabalho
A planilha usa códigos para indicar o status de cada dia:
- `.` = **Trabalha** (seguindo a escala normal)
- `FR` = Folga/Repouso
- `FE` = Férias
- `AFS` = Afastamento
- `TR` = Treinamento
- Outros códigos = Situações especiais

### Agregação dos Dados
1. Os dados são contabilizados por **dia do mês** (1-31)
2. Para cada dia, conta-se quantas pessoas de cada **função** estão trabalhando
3. Os dados também são organizados por **departamento**
4. Filtros podem ser aplicados para análise específica

## 🔄 Atualizar os Dados

Para atualizar com uma nova planilha:

1. Substitua o arquivo `dados.xlsx`
2. Execute o script de conversão:

```bash
python3 << 'EOF'
import pandas as pd
import json

df = pd.read_excel('dados.xlsx')
df_filtered = df[df['NOME'] != 'NOME'].copy()
df_filtered = df_filtered[df_filtered['RESPONSAVEL'] != 'RESPONSAVEL'].copy()
df_filtered = df_filtered[df_filtered['FUNÇÃO'].notna()].copy()
df_filtered = df_filtered[df_filtered['DEPART'].notna()].copy()
df_filtered.reset_index(drop=True, inplace=True)

data_por_dia = {}

for dia in range(1, 32):
    if dia not in df_filtered.columns:
        continue

    data_por_dia[dia] = {
        'por_funcao': {},
        'por_departamento': {},
        'total': 0
    }

    for _, row in df_filtered.iterrows():
        funcao = str(row['FUNÇÃO']).strip()
        depart = str(row['DEPART']).strip()
        valor_dia = str(row[dia]).strip()

        trabalhando = valor_dia == '.'

        if trabalhando:
            if funcao not in data_por_dia[dia]['por_funcao']:
                data_por_dia[dia]['por_funcao'][funcao] = {'count': 0, 'departamentos': {}}
            data_por_dia[dia]['por_funcao'][funcao]['count'] += 1

            if depart not in data_por_dia[dia]['por_funcao'][funcao]['departamentos']:
                data_por_dia[dia]['por_funcao'][funcao]['departamentos'][depart] = 0
            data_por_dia[dia]['por_funcao'][funcao]['departamentos'][depart] += 1

            if depart not in data_por_dia[dia]['por_departamento']:
                data_por_dia[dia]['por_departamento'][depart] = 0
            data_por_dia[dia]['por_departamento'][depart] += 1

            data_por_dia[dia]['total'] += 1

funcoes = sorted([str(f).strip() for f in df_filtered['FUNÇÃO'].unique() if pd.notna(f)])
departamentos = sorted([str(d).strip() for d in df_filtered['DEPART'].unique() if pd.notna(d)])

dados_finais = {
    'data_por_dia': data_por_dia,
    'funcoes': funcoes,
    'departamentos': departamentos,
    'total_pessoas': len(df_filtered)
}

with open('dados.json', 'w', encoding='utf-8') as f:
    json.dump(dados_finais, f, ensure_ascii=False, indent=2)

print("Dados atualizados com sucesso!")
EOF
```

3. Recarregue a página no navegador

## 🎨 Personalização

### Cores
As cores das linhas estão definidas no arquivo `app.js` na variável `coresFixas`.
Edite para personalizar a paleta de cores.

### Tamanho do Gráfico
O gráfico ocupa 70% da altura da página (70vh). Para ajustar, edite a classe `.chart-container` no `index.html`:

```css
.chart-container {
    height: 70vh; /* Altere aqui */
    padding: 30px;
}
```

## 📈 Estatísticas do Projeto

- **Total de Funcionários**: 869
- **Total de Funções**: 51
- **Total de Departamentos**: 57
- **Média de Trabalho**: ~734 pessoas/dia
- **Funções Principais**:
  - AUXILIAR DE RAMPA
  - OPERADOR DE EQUIPAMENTOS
  - LIDER DE RAMPA
  - AUXILIAR DE LIMPEZA
  - AUXILIAR DE TRIAGEM

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e responsividade
- **JavaScript**: Lógica e interatividade
- **Chart.js 4.4.0**: Biblioteca de gráficos
- **chartjs-plugin-trendline**: Plugin para linhas de tendência
- **Python + Pandas**: Processamento de dados Excel

## 📝 Licença

Este projeto é de uso interno para visualização de escalas de trabalho.

---

**Desenvolvido para facilitar a gestão e visualização de escalas de trabalho** 🚀
