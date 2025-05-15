# pagarme/moment

Esse repositório visa unificar a utilização do `moment` pelos nossos principais projetos. A ideia é que possamos centralizar algumas lógicas relacionadas a data, fuso horário e horário de verão.

## Mas o que essa lib faz efetivamente?

O código fonte é bem simples, ele simplesmente importa a biblioteca `moment-timezone`, define o `timezone` padrão como `America/Sao_Paulo` e exporta de volta a biblioteca.
