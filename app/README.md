# Sistema de Geração de Documentos - CyberShield

Sistema automático para converter arquivos Markdown em documentos HTML com identidade visual da CyberShield, otimizados para impressão e geração de PDF.

## 🚀 Características

- **Conversão Automática**: Converte todos os arquivos `.md` em documentos HTML
- **Identidade Visual**: Mantém a identidade visual da CyberShield
- **Otimizado para Impressão**: CSS otimizado para geração de PDF
- **Responsivo**: Funciona em diferentes dispositivos
- **Metadados**: Suporte a metadados personalizados
- **Tabelas**: Suporte completo a tabelas Markdown
- **Código**: Syntax highlighting para blocos de código

## 📋 Pré-requisitos

- Python 3.7 ou superior
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

### Método 1: Script Automático (Recomendado)

```bash
# Tornar o script executável
chmod +x setup.sh

# Executar configuração
./setup.sh
```

### Método 2: Instalação Manual

```bash
# 1. Criar ambiente virtual (opcional, mas recomendado)
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Criar diretórios
mkdir -p generated_documents
mkdir -p templates
```

## 📖 Como Usar

### Gerar Todos os Documentos

```bash
python3 generate_documents.py
```

### Gerar Documento Específico

```bash
python3 generate_documents.py --file caminho/para/arquivo.md
```

### Diretórios Customizados

```bash
python3 generate_documents.py --input diretorio_entrada --output diretorio_saida
```

### Opções Disponíveis

```bash
python3 generate_documents.py --help
```

## 📁 Estrutura de Arquivos

```
.
├── generate_documents.py    # Script principal
├── requirements.txt         # Dependências Python
├── setup.sh                # Script de configuração
├── README.md               # Esta documentação
├── CyberShield/            # Diretório de entrada (padrão)
│   └── **/*.md            # Arquivos Markdown
├── generated_documents/     # Diretório de saída (padrão)
│   └── **/*.html          # Documentos HTML gerados
└── templates/              # Templates personalizados (futuro)
```

## 🎨 Personalização

### Metadados nos Arquivos Markdown

Você pode adicionar metadados especiais nos arquivos Markdown:

```markdown
<!-- metadata: category: Documentos Institucionais -->
<!-- metadata: version: 2.1 -->
<!-- metadata: document_number: CON-001 -->

# Título do Documento

Conteúdo do documento...
```

### Configuração da Empresa

Edite as informações da empresa no arquivo `generate_documents.py`:

```python
self.company_info = {
    "name": "CyberShield",
    "full_name": "CyberShield Ltda.",
    "address": "Rua Pais Leme, 215, Conjunto 1713 - Pinheiros, São Paulo - SP, CEP: 05424-150",
    "cnpj": "00.000.000/0001-00",
    "website": "https://cybershield.com.br",
    "email": "contato@cybershieldgroup.com.br",
    "phone": "(11) 99999-9999"
}
```

## 🖨️ Geração de PDF

### Método 1: Navegador (Recomendado)

1. Abra o arquivo HTML gerado no navegador
2. Pressione `Ctrl+P` (ou `Cmd+P` no Mac)
3. Selecione "Salvar como PDF"
4. Configure as opções de impressão conforme necessário

### Método 2: Linha de Comando

```bash
# Usando wkhtmltopdf (instalar primeiro)
wkhtmltopdf --page-size A4 --margin-top 20mm --margin-bottom 20mm --margin-left 20mm --margin-right 20mm arquivo.html arquivo.pdf

# Usando puppeteer (Node.js)
npx puppeteer-pdf arquivo.html -o arquivo.pdf
```

## 📋 Formatos Suportados

### Markdown

- **Cabeçalhos**: `# ## ### #### ##### ######`
- **Tabelas**: Suporte completo a tabelas Markdown
- **Listas**: Ordenadas e não ordenadas
- **Código**: Blocos de código com syntax highlighting
- **Links**: Links internos e externos
- **Imagens**: Suporte a imagens
- **Ênfase**: **negrito**, *itálico*, `código inline`

### HTML Gerado

- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Impressão**: Otimizado para impressão/PDF
- **Acessibilidade**: Estrutura semântica adequada
- **Performance**: CSS otimizado

## 🔧 Solução de Problemas

### Erro: "Module not found"

```bash
# Instalar dependências
pip install -r requirements.txt
```

### Erro: "Permission denied"

```bash
# Tornar script executável
chmod +x generate_documents.py
```

### Arquivos não encontrados

Verifique se o diretório de entrada está correto:

```bash
python3 generate_documents.py --input /caminho/correto/para/arquivos
```

### Problemas de codificação

Certifique-se de que os arquivos Markdown estão em UTF-8:

```bash
# Verificar codificação
file -i arquivo.md
```

## 🚀 Exemplos de Uso

### Exemplo 1: Gerar todos os documentos

```bash
python3 generate_documents.py
```

### Exemplo 2: Gerar documento específico

```bash
python3 generate_documents.py --file CyberShield/DocumentacaoCyberShield/01_Documentos_Institucionais/01_Contrato_Social.md
```

### Exemplo 3: Diretórios customizados

```bash
python3 generate_documents.py --input ./meus_documentos --output ./documentos_gerados
```

## 📝 Logs e Debug

O sistema exibe informações sobre o progresso:

```
Encontrados 85 arquivos Markdown
Iniciando geração de documentos...
✓ Gerado: generated_documents/CyberShield/DocumentacaoCyberShield/01_Documentos_Institucionais/01_Contrato_Social.html
✓ Gerado: generated_documents/CyberShield/DocumentacaoCyberShield/01_Documentos_Institucionais/02_Contrato_Prestacao_Servicos.html
...

Resumo:
✓ Sucessos: 85
✗ Falhas: 0
📁 Documentos gerados em: generated_documents
```

## 🤝 Contribuição

Para contribuir com melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste o sistema
5. Envie um pull request

## 📄 Licença

Este projeto é parte da CyberShield e está sob a mesma licença da empresa.

## 📞 Suporte

Para suporte técnico ou dúvidas:

- Email: contato@cybershieldgroup.com.br
- Telefone: (11) 99999-9999

---

**CyberShield** - Soluções digitais profissionais 