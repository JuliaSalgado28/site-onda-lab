# Guia — Página "Projeto Proprietário" e banco de leads

A página `projeto-proprietario.html` entrega a pesquisa **IA no Mercado de Trabalho** em troca de um cadastro (nome, e-mail, cargo, empresa). Cada cadastro vira uma linha numa planilha Google Sheets — esse é o banco de leads.

Para a página funcionar, são **2 passos**: criar a planilha + publicar o script, e colar a URL do script na página. (Os PDFs já estão no site.)

---

## 1. PDFs da pesquisa — já incluídos

Os dois arquivos já estão na pasta `downloads/` do site:

- `onda-lab-ia-no-mercado-de-trabalho-relatorio-completo.pdf` (download principal, inicia automaticamente após o cadastro)
- `onda-lab-ia-no-mercado-de-trabalho-resumo-executivo.pdf` (segundo botão)

Para trocar uma versão, basta substituir o arquivo mantendo o nome. Para mudar o nome, edite `PDF_URL` / `PDF_RESUMO_URL` no bloco `CONFIGURAÇÃO` no final de `projeto-proprietario.html`.

## 2. Criar a planilha de leads e publicar o script — FEITO em 14/10/2026

> Já configurado: a URL do app da Web está colada em `LEADS_ENDPOINT` na página e foi testada (GET e POST retornando `{"ok":true}`). Os passos abaixo ficam como referência para republicar ou recriar.

1. Acesse [sheets.new](https://sheets.new) com a conta Google da Onda Lab e nomeie a planilha, por exemplo **Leads — Pesquisa IA no Mercado de Trabalho**.
2. Menu **Extensões → Apps Script**. Apague o conteúdo que aparece no editor.
3. Copie todo o conteúdo do arquivo `leads/google-apps-script.gs` e cole no editor. Salve (ícone de disquete ou Ctrl+S).
4. Ajuste, se quiser, as duas linhas do topo:
   - `AVISAR_POR_EMAIL = true` → manda um e-mail a cada novo lead.
   - `EMAILS_AVISO = 'julia@ondalab.com.br'` → quem recebe o aviso (separe com vírgula para mais pessoas).
5. Clique em **Implantar → Nova implantação**.
   - Em "Selecionar tipo" (engrenagem), escolha **App da Web**.
   - **Executar como:** *Eu* (sua conta).
   - **Quem pode acessar:** *Qualquer pessoa*. ← obrigatório, senão o site não consegue enviar.
   - Clique em **Implantar**, autorize o acesso quando o Google pedir (a tela "app não verificado" é normal: clique em *Avançado → Acessar…*).
6. Copie a **URL do app da Web** (começa com `https://script.google.com/macros/s/…/exec`).
7. Teste: cole a URL numa aba do navegador. Deve aparecer *"Onda Lab — endpoint de leads ativo."*

> **Alterou o script depois?** Precisa publicar de novo: *Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar*. A URL continua a mesma.

## 3. Colar a URL na página — FEITO

1. Abra `projeto-proprietario.html` e vá até o final do arquivo (bloco `CONFIGURAÇÃO`).
2. Cole a URL entre as aspas: `var LEADS_ENDPOINT = 'https://script.google.com/macros/s/…/exec';`
3. Salve e faça o commit/push. Em 1–2 minutos o GitHub Pages atualiza o site.

## 4. Testar de ponta a ponta

1. Abra `https://ondalab.com.br/projeto-proprietario.html` numa **janela anônima**.
2. Preencha o formulário com dados de teste e envie.
3. Confira: (a) apareceu a tela "Cadastro confirmado", o relatório completo baixou e o botão do resumo executivo funciona; (b) surgiu uma linha nova na aba **Leads** da planilha; (c) chegou o e-mail de aviso.
4. Apague a linha de teste da planilha.

---

## Como funciona (para quem precisar mexer)

- O formulário envia os dados em JSON para `LEADS_ENDPOINT`. Se a URL for do Google Apps Script, o envio é feito em modo `no-cors` (o navegador não lê a resposta, mas o dado chega). Se for um endpoint Formspree, o envio vai como `FormData` e a página só libera o download se a resposta for `200`.
- Campos gravados: data/hora (fuso de São Paulo), nome, e-mail, cargo, empresa, consentimento, origem, página, UTM (`?utm_source=…` da URL, útil para medir campanhas no LinkedIn).
- Há um campo invisível ("honeypot") para barrar robôs: se vier preenchido, o cadastro é descartado sem alarde.
- Depois do cadastro, o navegador guarda uma marca (`localStorage`); quem voltar à página não precisa preencher de novo. Para forçar o formulário em testes, use janela anônima.
- O PDF fica num endereço público do site (limitação natural de um site estático). É o padrão de mercado para materiais ricos; o cadastro é a "porta", não um cofre.

## Alternativa: Formspree em vez de Google Sheets

Se preferir não mexer no Apps Script: crie um **formulário novo** no [formspree.io](https://formspree.io) (não reutilize o de contato, para não misturar leads com mensagens), copie o endpoint `https://formspree.io/f/xxxxxxxx` e cole em `LEADS_ENDPOINT`. Os leads ficam no painel do Formspree, com exportação em CSV. O plano gratuito limita o volume mensal de envios — para um lançamento com divulgação, a planilha Google é mais folgada e já é o banco de dados pronto.

## Regras de sempre no deploy

- **Nunca apague o arquivo `CNAME`** (`ondalab.com.br`) — sem ele o domínio para de funcionar.
- Os arquivos HTML são grandes (imagens embutidas em base64); edite com cuidado e teste no site publicado.
