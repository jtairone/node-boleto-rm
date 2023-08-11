const Boleto = require('../../../index').Boleto
const moment = require('moment')
const expect = require('chai').expect

describe('Bradesco Boleto', () => {
  describe('when creating a valid boleto', () => {
    let boletos = []
    before(() => {
      boletos.push(new Boleto({
        'banco': 'bradesco',
        'data_emissao': moment('2017-01-01T00:00:00Z').valueOf(),
        'data_vencimento': moment('2017-01-05T00:00:00Z').valueOf(),
        'valor': 1500,
        'nosso_numero': '6',
        'numero_documento': '1',
        'cedente': 'Pagar.me Pagamentos S/A',
        'cedente_cnpj': '18727053000174',
        'agencia': '1229',
        'codigo_cedente': '469',
        'carteira': '25',
        'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
        'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
        'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
      }))
    })

    before(() => {
      boletos.push(new Boleto({
        'banco': 'bradesco',
        'data_emissao': moment('2017-01-01T00:00:00Z').toDate(),
        'data_vencimento': moment('2017-01-05T01:00:00Z').toDate(),
        'valor': 1500,
        'nosso_numero': '6',
        'numero_documento': '1',
        'cedente': 'Pagar.me Pagamentos S/A',
        'cedente_cnpj': '18727053000174',
        'agencia': '1229',
        'codigo_cedente': '469',
        'carteira': '25',
        'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
        'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
        'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
      }))
    })

    before(() => {
      boletos.push(new Boleto({
        'banco': 'bradesco',
        'data_emissao': moment('2017-01-01T00:00:00Z').format(),
        'data_vencimento': moment('2017-01-05T02:00:00Z').format(),
        'valor': 1500,
        'nosso_numero': '6',
        'numero_documento': '1',
        'cedente': 'Pagar.me Pagamentos S/A',
        'cedente_cnpj': '18727053000174',
        'agencia': '1229',
        'codigo_cedente': '469',
        'carteira': '25',
        'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
        'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
        'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
      }))
    })

    before(() => {
      boletos.push(new Boleto({
        'banco': 'bradesco',
        'data_emissao': new Date('2017-01-01T23:00:00Z').getTime(),
        'data_vencimento': new Date('2017-01-05T23:00:00Z').getTime(),
        'valor': 1500,
        'nosso_numero': '6',
        'numero_documento': '1',
        'cedente': 'Pagar.me Pagamentos S/A',
        'cedente_cnpj': '18727053000174',
        'agencia': '1229',
        'codigo_cedente': '469',
        'carteira': '25',
        'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
        'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
        'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
      }))
    })

    before(() => {
      boletos.push(new Boleto({
        'banco': 'bradesco',
        'data_emissao': new Date('2017-01-01T00:00:00Z').getTime(),
        'data_vencimento': new Date('2017-01-05T00:00:00Z').getTime(),
        'valor': 1500,
        'nosso_numero': '6',
        'numero_documento': '1',
        'cedente': 'Pagar.me Pagamentos S/A',
        'cedente_cnpj': '18727053000174',
        'agencia': '1229',
        'codigo_cedente': '469',
        'carteira': '25',
        'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
        'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
        'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
      }))
    })

    it('contains correct bank options', () => {
      boletos.forEach(boleto => {
        expect(boleto.bank.options).to.have.property('logoURL').that.contains('bradesco.jpg')
        expect(boleto.bank.options).to.have.property('codigo', '237')
      })
    })

    it('contains correct codigo_banco', () => {
      boletos.forEach(boleto => {
        expect(boleto.codigo_banco).to.equal('237-2')
      })
    })

    it('contains correct barcode_data', () => {
      boletos.forEach(boleto => {
        expect(boleto.barcode_data).to.equal('23794703000000015001229250000000000600004690')
      })
    })

    it('contains correct linha_digitavel', () => {
      boletos.forEach(boleto => {
        expect(boleto.linha_digitavel).to.equal('23791.22928 50000.000005 06000.046901 4 70300000001500')
      })
    })
  })
})
