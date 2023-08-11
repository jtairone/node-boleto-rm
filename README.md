node-boleto-rm
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
npm install node-boleto-rm
```

## Exemplo de uso

Emitindo um boleto:

```javascript
var Boletorm = require('node-boletor-rm').Boleto;

var boleto = new Boletorm({
  
  'banco': `santander`, // nome do banco dentro da pasta 'banks'
  'data_emissao': new Date(), //data emissão (exemplo gera data hoje)
  //'logo': '' //link para logo da empresa,
  'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000), // 5 dias futuramente,
  'valor': 1500, // R$ 15,00 (valor em centavos)
  'jurosdia': `${ret.rows[i].JUROSDIA}`,
  'nosso_numero': `1234567`,
  'barcode_data':  `3435645645567567` //dados do codigo de barras,
 // 'barcode_count': `${i}`, //utilizo para gerar mais de um titulo ao mesmo tempo analisar código
  'linha_digitavel': `456756878678678687`,
  'numero_documento': `1234567`,
  'instrucoes': `INSTRUÇÕES DO BOLETO`,
  'pagador': `JOSE`,
      'pagador_cpf_cnpj': `05055555050555`, //somente numeros
      'pagador_endereco_rua_num': `RUA DEZ 10`,
      'pagador_endereco_bairro': `CENTRO`,
      'pagador_endereco_cep': `55555555`, //somente numeros
      'pagador_endereco_cidade_estado': `NATAL-RN`,
      'pagador_outras_informacoes': ``,
  'cedente': `EMPRESA`,
  'cedente_cnpj': `99999999999999`, // sem pontos e traços
  'cedente_endereco_rua_num': `RUA ONZE 22`,
  'cedente_endereco_bairro': `CENTRO`,
  'cedente_endereco_cep': `5959090`,
  'cedente_endereco_cidade_estado': `NATAL-RN`,
  'agencia': `3978`,
  'codigo_cedente':  "6404154", // PSK (código da carteira),
  //'carteira': "102"
  //'barcodeRenderEngine': 'bmp'

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


