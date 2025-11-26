// Variáveis globais
let dadosOriginais = null;
let graficoAtual = null;
const coresFixas = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b',
    '#fa709a', '#fee140', '#30cfd0', '#a8edea', '#ff6b6b',
    '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9',
    '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e', '#e17055'
];

// Carregar dados ao iniciar
window.addEventListener('load', async () => {
    try {
        const response = await fetch('dados.json');
        dadosOriginais = await response.json();

        // Preencher filtros
        preencherFiltros();

        // Criar gráfico inicial
        criarGrafico();

        // Atualizar estatísticas
        atualizarEstatisticas();

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Verifique se o arquivo dados.json existe.');
    }
});

function preencherFiltros() {
    // Preencher departamentos
    const selectDepartamento = document.getElementById('filterDepartamento');
    dadosOriginais.departamentos.forEach(depto => {
        const option = document.createElement('option');
        option.value = depto;
        option.textContent = depto;
        selectDepartamento.appendChild(option);
    });

    // Preencher funções
    const selectFuncao = document.getElementById('filterFuncao');
    dadosOriginais.funcoes.forEach(funcao => {
        const option = document.createElement('option');
        option.value = funcao;
        option.textContent = funcao;
        selectFuncao.appendChild(option);
    });
}

function obterDadosFiltrados() {
    const departamentoSelecionado = document.getElementById('filterDepartamento').value;
    const funcoesSelect = document.getElementById('filterFuncao');
    const funcoesSelecionadas = Array.from(funcoesSelect.selectedOptions)
        .map(option => option.value)
        .filter(v => v !== '');

    const dias = Array.from({length: 31}, (_, i) => i + 1);
    const datasets = [];
    const funcoesPorDia = {};

    // Preparar dados por função
    dias.forEach(dia => {
        if (!dadosOriginais.data_por_dia[dia]) return;

        const diaData = dadosOriginais.data_por_dia[dia];

        Object.entries(diaData.por_funcao).forEach(([funcao, info]) => {
            // Aplicar filtro de função
            if (funcoesSelecionadas.length > 0 && !funcoesSelecionadas.includes(funcao)) {
                return;
            }

            // Aplicar filtro de departamento
            let count = info.count;
            if (departamentoSelecionado) {
                count = info.departamentos[departamentoSelecionado] || 0;
            }

            if (count > 0) {
                if (!funcoesPorDia[funcao]) {
                    funcoesPorDia[funcao] = new Array(31).fill(0);
                }
                funcoesPorDia[funcao][dia - 1] = count;
            }
        });
    });

    // Criar datasets
    // Se não há filtros de função, pegar as top 10 funções
    let funcoesParaMostrar = Object.keys(funcoesPorDia);

    if (funcoesSelecionadas.length === 0) {
        // Ordenar por total de pessoas-dia e pegar top 10
        const totaisPorFuncao = Object.entries(funcoesPorDia).map(([funcao, valores]) => ({
            funcao,
            total: valores.reduce((a, b) => a + b, 0)
        }));

        totaisPorFuncao.sort((a, b) => b.total - a.total);
        funcoesParaMostrar = totaisPorFuncao.slice(0, 10).map(f => f.funcao);
    }

    funcoesParaMostrar.forEach((funcao, index) => {
        const cor = coresFixas[index % coresFixas.length];

        datasets.push({
            label: funcao,
            data: funcoesPorDia[funcao],
            borderColor: cor,
            backgroundColor: cor + '20',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
            // Configuração da linha de tendência
            trendlineLinear: {
                style: cor,
                lineStyle: "dotted",
                width: 2
            }
        });
    });

    return {
        labels: dias,
        datasets: datasets
    };
}

function criarGrafico() {
    const ctx = document.getElementById('graficoEscala').getContext('2d');

    // Destruir gráfico anterior se existir
    if (graficoAtual) {
        graficoAtual.destroy();
    }

    const dadosFiltrados = obterDadosFiltrados();

    graficoAtual = new Chart(ctx, {
        type: 'line',
        data: dadosFiltrados,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Quantidade de Pessoas Trabalhando por Dia',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(context) {
                            return 'Dia ' + context[0].label;
                        },
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' pessoas';
                        },
                        afterBody: function(context) {
                            const total = context.reduce((sum, item) => sum + item.parsed.y, 0);
                            return '\nTotal: ' + total + ' pessoas';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Dia do Mês',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade de Pessoas',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function atualizarEstatisticas() {
    const departamentoSelecionado = document.getElementById('filterDepartamento').value;
    const funcoesSelect = document.getElementById('filterFuncao');
    const funcoesSelecionadas = Array.from(funcoesSelect.selectedOptions)
        .map(option => option.value)
        .filter(v => v !== '');

    const totaisPorDia = [];

    for (let dia = 1; dia <= 31; dia++) {
        if (!dadosOriginais.data_por_dia[dia]) continue;

        let totalDia = 0;
        const diaData = dadosOriginais.data_por_dia[dia];

        Object.entries(diaData.por_funcao).forEach(([funcao, info]) => {
            // Aplicar filtros
            if (funcoesSelecionadas.length > 0 && !funcoesSelecionadas.includes(funcao)) {
                return;
            }

            let count = info.count;
            if (departamentoSelecionado) {
                count = info.departamentos[departamentoSelecionado] || 0;
            }

            totalDia += count;
        });

        totaisPorDia.push(totalDia);
    }

    if (totaisPorDia.length > 0) {
        const media = Math.round(totaisPorDia.reduce((a, b) => a + b, 0) / totaisPorDia.length);
        const minimo = Math.min(...totaisPorDia);
        const maximo = Math.max(...totaisPorDia);

        document.getElementById('statMedia').textContent = media;
        document.getElementById('statMinimo').textContent = minimo;
        document.getElementById('statMaximo').textContent = maximo;
    }

    document.getElementById('statTotal').textContent = dadosOriginais.total_pessoas;
}

function aplicarFiltros() {
    criarGrafico();
    atualizarEstatisticas();
}

function resetarFiltros() {
    document.getElementById('filterDepartamento').value = '';
    document.getElementById('filterFuncao').selectedIndex = 0;

    // Limpar todas as seleções do select múltiplo
    const selectFuncao = document.getElementById('filterFuncao');
    for (let option of selectFuncao.options) {
        option.selected = false;
    }

    criarGrafico();
    atualizarEstatisticas();
}

// Adicionar evento de Enter nos filtros
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('filterDepartamento')?.addEventListener('change', aplicarFiltros);
});
