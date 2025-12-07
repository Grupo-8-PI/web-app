const statusMessages = {
    400: 'Dados inválidos. Verifique as informações e tente novamente.',
    401: 'Houve um erro no login, suas credenciais estão inválidas ou o servidor está offline, tente novamente!',
    403: 'Acesso negado. Você não tem permissão para realizar esta ação.',
    404: 'Recurso não encontrado.',
    409: 'Já existe um cadastro com estes dados.',
    422: 'Dados inválidos. Verifique os campos e tente novamente.',
    429: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    500: 'Erro interno do sistema. Tente novamente mais tarde.',
    502: 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.',
    503: 'Serviço em manutenção. Tente novamente mais tarde.',
};

const fieldMessages = {
    email: {
        invalid: 'Email inválido. Verifique o formato do email.',
        exists: 'Este email já está cadastrado.',
        required: 'Email é obrigatório.',
    },
    cpf: {
        invalid: 'CPF inválido. Verifique o número digitado.',
        exists: 'Este CPF já está cadastrado.',
        required: 'CPF é obrigatório.',
    },
    senha: {
        short: 'A senha deve ter no mínimo 6 caracteres.',
        weak: 'A senha deve conter letras e números.',
        required: 'Senha é obrigatória.',
    },
    telefone: {
        invalid: 'Telefone inválido. Use o formato (XX) XXXXX-XXXX.',
        required: 'Telefone é obrigatório.',
    },
    nome: {
        short: 'Nome muito curto. Digite seu nome completo.',
        required: 'Nome é obrigatório.',
    },
    dtNascimento: {
        invalid: 'Data de nascimento inválida.',
        required: 'Data de nascimento é obrigatória.',
    }
};

function extractErrorMessage(errorData, context = '') {
    if (errorData.message) {
        const msg = errorData.message.toLowerCase();
        
        if (msg.includes('email') && msg.includes('já existe')) {
            return fieldMessages.email.exists;
        }
        if (msg.includes('email') && msg.includes('inválido')) {
            return fieldMessages.email.invalid;
        }
        
        if (msg.includes('cpf') && msg.includes('já existe')) {
            return fieldMessages.cpf.exists;
        }
        if (msg.includes('cpf') && msg.includes('inválido')) {
            return fieldMessages.cpf.invalid;
        }
        
        if (msg.includes('senha') && msg.includes('curta')) {
            return fieldMessages.senha.short;
        }
        if (msg.includes('senha') && msg.includes('fraca')) {
            return fieldMessages.senha.weak;
        }
        
        // Skip credenciais check for login context - let status code handle it
        if ((msg.includes('credenciais') || msg.includes('não autorizado')) && context !== 'login') {
            return 'Email ou senha incorretos.';
        }
        
        if (msg.includes('idade') || msg.includes('menor de idade')) {
            return 'Data de nascimento inválida.';
        }
        
        if (!msg.includes('exception') && !msg.includes('null') && msg.length < 150) {
            return errorData.message;
        }
    }
    
    if (errorData.errors && Array.isArray(errorData.errors)) {
        return errorData.errors.join('. ');
    }
    
    return null;
}

export function handleHttpError(error, context = '') {
    console.error(`[ErrorHandler] Erro em ${context}:`, error);
    
    if (!error.response) {
        if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
            return {
                message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
                type: 'error'
            };
        }
        
        if (error.message === 'Sessão expirada') {
            return {
                message: 'Sua sessão expirou. Faça login novamente.',
                type: 'warning'
            };
        }
        
        return {
            message: 'Erro de conexão. Tente novamente.',
            type: 'error'
        };
    }
    
    const { status, data } = error.response;
    
    console.log(`[ErrorHandler] Status: ${status}, Data:`, data);
    
    const specificMessage = extractErrorMessage(data, context);
    if (specificMessage) {
        return {
            message: specificMessage,
            type: status >= 500 ? 'error' : 'warning'
        };
    }
    
    const defaultMessage = statusMessages[status];
    if (defaultMessage) {
        return {
            message: defaultMessage,
            type: status >= 500 ? 'error' : 'warning'
        };
    }
    
    if (status >= 500) {
        return {
            message: 'Erro interno do sistema. Tente novamente mais tarde.',
            type: 'error'
        };
    }
    
    if (status >= 400) {
        return {
            message: 'Não foi possível processar sua solicitação. Verifique os dados e tente novamente.',
            type: 'warning'
        };
    }
    
    return {
        message: 'Erro inesperado. Tente novamente.',
        type: 'error'
    };
}

export function validateForm(data, formType) {
    if (formType === 'login') {
        if (!data.email || !data.email.trim()) {
            return { field: 'email', message: fieldMessages.email.required };
        }
        
        if (!data.senha || !data.senha.trim()) {
            return { field: 'senha', message: fieldMessages.senha.required };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { field: 'email', message: fieldMessages.email.invalid };
        }
    }
    
    if (formType === 'cadastro') {
        if (!data.nome || data.nome.trim().length < 3) {
            return { field: 'nome', message: fieldMessages.nome.short };
        }
        
        if (!data.email || !data.email.trim()) {
            return { field: 'email', message: fieldMessages.email.required };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { field: 'email', message: fieldMessages.email.invalid };
        }
        
        if (!data.cpf || data.cpf.replace(/\D/g, '').length !== 11) {
            return { field: 'cpf', message: fieldMessages.cpf.invalid };
        }
        
        if (!data.senha || data.senha.length < 6) {
            return { field: 'senha', message: fieldMessages.senha.short };
        }
        
        if (!data.telefone || data.telefone.replace(/\D/g, '').length < 10) {
            return { field: 'telefone', message: fieldMessages.telefone.invalid };
        }
        
        if (!data.dtNascimento) {
            return { field: 'dtNascimento', message: fieldMessages.dtNascimento.required };
        }
    }
    
    return null;
}

export function formatCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatTelefone(telefone) {
    const cleaned = telefone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}