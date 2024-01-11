const formatters = require('../../lib/formatters')
const ediHelper = require('../../lib/edi-helper')

exports.options = {
  logoURL: 'https://i.ibb.co/9r9sqwj/caixa-logo.png',
  codigo: '104'
}
//console.log(this.options.codigo)
exports.dvBarra = function (barra) {
  var resto2 = formatters.mod11(barra, 9, 1)
  return (resto2 == 0 || resto2 == 1 || resto2 == 10) ? 1 : 11 - resto2
}

exports.barcodeData = function (boleto) {
  var codigoBanco = this.options.codigo
  var numMoeda = '9'
  var fixo = '9' // Numero fixo para a posição 05-05
  var ios = '0' // IOS - somente para Seguradoras (Se 7% informar 7, limitado 9%) - demais clientes usar 0

  var fatorVencimento = formatters.fatorVencimento(moment(boleto['data_vencimento']).utc().format())

  var valor = formatters.addTrailingZeros(boleto['valor'], 10)
  var carteira = boleto['carteira']
  var codigoCedente = formatters.addTrailingZeros(boleto['codigo_cedente'], 7)

  var nossoNumero = formatters.addTrailingZeros(boleto['nosso_numero'], 12) + formatters.mod11(boleto['nosso_numero'])

  var barra = codigoBanco + numMoeda + fatorVencimento + valor + fixo + codigoCedente + nossoNumero + ios + carteira

  var dvBarra = this.dvBarra(barra)
  var lineData = barra.substring(0, 4) + dvBarra + barra.substring(4, barra.length)

  return lineData
}

exports.linhaDigitavel = function (barcodeData) {
  // Posição   Conteúdo
  // 1 a 3    Número do banco
  // 4        Código da Moeda - 9 para Real ou 8 - outras moedas
  // 5        Fixo "9'
  // 6 a 9    PSK - codigo cliente (4 primeiros digitos)
  // 10 a 12  Restante do PSK (3 digitos)
  // 13 a 19  7 primeiros digitos do Nosso Numero
  // 20 a 25  Restante do Nosso numero (8 digitos) - total 13 (incluindo digito verificador)
  // 26 a 26  IOS
  // 27 a 29  Tipo Modalidade Carteira
  // 30 a 30  Dígito verificador do código de barras
  // 31 a 34  Fator de vencimento (qtdade de dias desde 07/10/1997 até a data de vencimento)
  // 35 a 44  Valor do título

  var campos = []

  // 1. Primeiro Grupo - composto pelo código do banco, código da moéda, Valor Fixo "9"
  // e 4 primeiros digitos do PSK (codigo do cliente) e DV (modulo10) deste campo
  var campo = barcodeData.substring(0, 3) + barcodeData.substring(3, 4) + barcodeData.substring(19, 20) + barcodeData.substring(20, 24)
  campo = campo + formatters.mod10(campo)
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length)
  campos.push(campo)

  // 2. Segundo Grupo - composto pelas 3 últimas posiçoes do PSK e 7 primeiros dígitos do Nosso Número
  // e DV (modulo10) deste campo
  campo = barcodeData.substring(24, 34)
  campo = campo + formatters.mod10(campo)
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length)
  campos.push(campo)

  // 3. Terceiro Grupo - Composto por : Restante do Nosso Numero (6 digitos), IOS, Modalidade da Carteira
  // e DV (modulo10) deste campo
  campo = barcodeData.substring(34, 44)
  campo = campo + formatters.mod10(campo)
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length)
  campos.push(campo)

  // 4. Campo - digito verificador do codigo de barras
  campo = barcodeData.substring(4, 5)
  campos.push(campo)

  // 5. Campo composto pelo fator vencimento e valor nominal do documento, sem
  // indicacao de zeros a esquerda e sem edicao (sem ponto e virgula). Quando se
  // tratar de valor zerado, a representacao deve ser 0000000000 (dez zeros).
  campo = barcodeData.substring(5, 9) + barcodeData.substring(9, 19)
  campos.push(campo)

  return campos.join(' ')
}

exports.parseEDIFile = function (fileContent) {
  try {
    const lines = fileContent.split('\n')
    const parsedFile = {
      boletos: []
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const registro = line.substring(0, 1)
      const inscricao = line.substring(1, 3)

      if (registro === '0') {
        parsedFile['razao_social'] = line.substring(46, 76)
        parsedFile['data_arquivo'] = ediHelper.dateFromEdiDate(line.substring(94, 100))
      } else if (registro === '1' && inscricao === '01' || inscricao === '02') {
        const boleto = {}

        parsedFile['cnpj'] = formatters.removeTrailingZeros(line.substring(3, 17))
        parsedFile['carteira'] = formatters.removeTrailingZeros(line.substring(106, 108))
        parsedFile['agencia_cedente'] = formatters.removeTrailingZeros(line.substring(17, 21))
        parsedFile['conta_cedente'] = formatters.removeTrailingZeros(line.substring(21, 27))

        boleto['codigo_ocorrencia'] = line.substring(108, 110)

        const motivosOcorrencia = line.substring(79, 82).trim()

        let isPaid = (parseInt(boleto['valor_pago']) >= parseInt(boleto['valor']) || boleto['codigo_ocorrencia'] === '21')

        if (motivosOcorrencia !== '') {
          isPaid = false
        }

        boleto['motivos_ocorrencia'] = motivosOcorrencia
        boleto['data_ocorrencia'] = ediHelper.dateFromEdiDate(line.substring(110, 116))
        boleto['data_credito'] = ediHelper.dateFromEdiDate(line.substring(293, 299))
        boleto['vencimento'] = ediHelper.dateFromEdiDate(line.substring(146, 152))
        boleto['valor'] = formatters.removeTrailingZeros(line.substring(152, 165))
        boleto['banco_recebedor'] = formatters.removeTrailingZeros(line.substring(165, 168))
        boleto['agencia_recebedora'] = formatters.removeTrailingZeros(line.substring(168, 173))
        boleto['paid'] = isPaid
        boleto['edi_line_number'] = i
        boleto['edi_line_checksum'] = ediHelper.calculateLineChecksum(line)
        boleto['edi_line_fingerprint'] = boleto['edi_line_number'] + ':' + boleto['edi_line_checksum']
        boleto['nosso_numero'] = formatters.removeTrailingZeros(line.substring(58, 73))
        boleto['iof_devido'] = formatters.removeTrailingZeros(line.substring(214, 227))
        boleto['abatimento_concedido'] = formatters.removeTrailingZeros(line.substring(227, 240))
        boleto['desconto_concedido'] = formatters.removeTrailingZeros(line.substring(240, 253))
        boleto['valor_pago'] = formatters.removeTrailingZeros(line.substring(253, 266))
        boleto['juros_mora'] = formatters.removeTrailingZeros(line.substring(266, 279))
        boleto['outros_creditos'] = formatters.removeTrailingZeros(line.substring(279, 292))

        parsedFile.boletos.push(boleto)
      }
    }

    return parsedFile
  } catch (e) {
    console.log(e)
    return null
  }
}
