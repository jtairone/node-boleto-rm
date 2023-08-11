node-boletos
=============
<!-- 
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) -->

Geração de boleto bancário em Node.js. Os algoritmos de geração da linha digitável e do código de barras foram inspirados no [boletophp](https://github.com/BielSystems/boletophp).

Projeto é um fork do node-boleto só acrescentado outros layouts de impressão de outros bancos que necessitei ai vi a necessidade de criar este projeto para mim.

## Bancos suportados (layout's impressão de boletos)

- Santander
- Bradesco
- Brasil
- Caixa
- Daycoval

## Instalação

```
npm install node-boletos
```

## Exemplo de uso

Emitindo um boleto:

```javascript
var Boleto = require('node-boletos').Boleto;

var boleto = new Boleto({
  'banco': "santander", // nome do banco dentro da pasta 'banks'
  'data_emissao': new Date(), //data emissão (exemplo gera data hoje)
  'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000), // 5 dias futuramente
  'valor': 1500, // R$ 15,00 (valor em centavos)
  'nosso_numero': "1234567",
  'numero_documento': "123123",
  'cedente': "Pagar.me Pagamentos S/A",
  'cedente_cnpj': "18727053000174", // sem pontos e traços
  'agencia': "3978",
  'codigo_cedente': "6404154", // PSK (código da carteira)
  'carteira': "102"
});

console.log("Linha digitável: " + boleto['linha_digitavel'])

boleto.renderHTML(function(html){
  console.log(html);
});
```

Parseando o arquivo-retorno EDI do banco:
* não validado em todos os bancos

```javascript
var ediParser = require('node-boleto').EdiParser,
	fs = require('fs');

var ediFileContent = fs.readFileSync("arquivo.txt").toString();

var parsedFile = ediParser.parse("santander", ediFileContent);

console.log("Boletos pagos: ");
console.log(parsedFile.boletos);
```

## Renderização do código de barras

Atualmente, há duas maneiras de renderizar o código de barras: `img` e `bmp`.

A engine `img` utiliza imagens brancas e pretas intercaladas para gerar o código de barras. Dessa forma, todos os browsers desde o IE6 são suportados. Esse modo de renderização, porém, é um pouco mais pesado, já que muitas `divs` são inseridas no HTML para a renderização.

A engine `bmp` aproveita da característica monodimensional dos códigos de barra e gera apenas a primeira linha de pixels do boleto, repetindo as outras linhas por CSS. É mais leve e funciona na maioria dos browser - IE apenas a partir da versão 8.

Para alterar a engine de renderização padrão:

```javascript
Boleto.barcodeRenderEngine = 'bmp';
```

## Licença

(The MIT License)


