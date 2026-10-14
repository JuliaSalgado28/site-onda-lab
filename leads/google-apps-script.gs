/**
 * Onda Lab — Banco de leads da pesquisa "IA no Mercado de Trabalho"
 *
 * Este script roda no Google Apps Script, colado dentro de uma planilha Google Sheets.
 * Ele recebe os cadastros enviados pela página projeto-proprietario.html e grava
 * uma linha por lead na aba "Leads". Opcionalmente avisa por e-mail a cada novo lead.
 *
 * Como instalar: veja leads/GUIA-LEADS.md (passo a passo com prints textuais).
 */

var ABA = 'Leads';
var AVISAR_POR_EMAIL = true;                 // false para desligar o aviso
var EMAILS_AVISO = 'julia@ondalab.com.br';   // separe por vírgula para mais de um destinatário

var COLUNAS = ['Data/hora', 'Nome', 'E-mail', 'Cargo', 'Empresa', 'Consentimento', 'Origem', 'Página', 'UTM', 'IP/UA'];

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents || '{}');
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);

    if (aba.getLastRow() === 0) {
      aba.appendRow(COLUNAS);
      aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold').setBackground('#2c2e83').setFontColor('#ffffff');
      aba.setFrozenRows(1);
    }

    var agora = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');
    aba.appendRow([
      agora,
      dados.nome || '',
      dados.email || '',
      dados.cargo || '',
      dados.empresa || '',
      dados.consentimento || '',
      dados.origem || '',
      dados.pagina || '',
      dados.utm || '',
      ''
    ]);

    if (AVISAR_POR_EMAIL && dados.email) {
      MailApp.sendEmail({
        to: EMAILS_AVISO,
        subject: 'Novo lead — Pesquisa IA no Mercado de Trabalho: ' + (dados.nome || '') + ' (' + (dados.empresa || '') + ')',
        htmlBody:
          '<p><b>Nome:</b> ' + (dados.nome || '') + '<br>' +
          '<b>E-mail:</b> ' + (dados.email || '') + '<br>' +
          '<b>Cargo:</b> ' + (dados.cargo || '') + '<br>' +
          '<b>Empresa:</b> ' + (dados.empresa || '') + '<br>' +
          '<b>Quando:</b> ' + agora + '</p>' +
          '<p><a href="' + planilha.getUrl() + '">Abrir planilha de leads</a></p>'
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Abrir a URL do script no navegador mostra esta mensagem — serve só para testar se a publicação funcionou.
function doGet() {
  return ContentService.createTextOutput('Onda Lab — endpoint de leads ativo.');
}
