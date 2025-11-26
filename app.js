// Configuração do Supabase
// As credenciais são carregadas de env.js (local) ou variáveis de ambiente (Netlify)
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'https://yuixpaydnmrdeywlstdn.supabase.co';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY;

// Verificar se as credenciais estão configuradas
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.error('❌ ERRO: Credenciais do Supabase não configuradas!');
    console.error('📝 Siga os passos:');
    console.error('1. Copie env.template.js para env.js');
    console.error('2. Edite env.js com sua chave do Supabase');
    console.error('3. Recarregue a página');

    // Mostrar erro na interface
    document.addEventListener('DOMContentLoaded', () => {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.className = 'error';
            messageDiv.innerHTML = `
                <strong>⚠️ Configuração Necessária</strong><br>
                1. Copie <code>env.template.js</code> para <code>env.js</code><br>
                2. Edite <code>env.js</code> com sua chave do Supabase<br>
                3. Recarregue a página
            `;
        }
    });
}

// Inicializar o cliente Supabase
// SOLUÇÃO PARA O ERRO CORS: Use o cliente oficial do Supabase
// ao invés de fazer fetch direto para as URLs
const supabase = SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE'
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Função para mostrar mensagens
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.className = type;
    messageDiv.textContent = message;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}

// Função para salvar nota
async function saveNote() {
    if (!supabase) {
        showMessage('Configure as credenciais do Supabase primeiro!', 'error');
        return;
    }

    const content = document.getElementById('noteContent').value;

    if (!content.trim()) {
        showMessage('Por favor, digite uma nota antes de salvar.', 'error');
        return;
    }

    try {
        // CORRETO: Usar o cliente Supabase ao invés de fetch direto
        const { data, error } = await supabase
            .from('notes')
            .insert([
                {
                    content: content,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        showMessage('Nota salva com sucesso!', 'success');
        document.getElementById('noteContent').value = '';
        loadNotes(); // Recarregar a lista

    } catch (error) {
        console.error('Erro ao salvar nota:', error);
        showMessage(`Erro: ${error.message}`, 'error');
    }
}

// Função para carregar notas
async function loadNotes() {
    if (!supabase) {
        displayNotes([]);
        return;
    }

    try {
        // CORRETO: Usar o cliente Supabase ao invés de fetch direto
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        displayNotes(data);

    } catch (error) {
        console.error('Erro ao carregar notas:', error);
        showMessage(`Erro ao carregar notas: ${error.message}`, 'error');
    }
}

// Função para exibir notas
function displayNotes(notes) {
    const notesListDiv = document.getElementById('notesList');

    if (!notes || notes.length === 0) {
        notesListDiv.innerHTML = '<p>Nenhuma nota encontrada.</p>';
        return;
    }

    notesListDiv.innerHTML = notes.map(note => `
        <div class="note-item">
            <div class="note-date">${new Date(note.created_at).toLocaleString('pt-BR')}</div>
            <div class="note-content">${escapeHtml(note.content)}</div>
        </div>
    `).join('');
}

// Função auxiliar para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Carregar notas ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});
