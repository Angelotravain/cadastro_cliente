# Instruções para Iniciar o Projeto Angular 13 com Angular Material

## Pré-requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Angular CLI](https://angular.io/cli) (versão 13 ou superior)

Você pode verificar as versões instaladas executando os seguintes comandos:

```bash
node -v
ng version
```
Observação:
- Para a instalação do Angular rode o seguuinte comando:
- npm install -g @angular/cli
- Caso esteja querendo usar a mesma versão do projeto rode:
- npm install -g @angular/cli@13
  
#Passos para baixar e rodar#
- Clone o repositório na sua máquina
- Vá até a pasta do projeto e rode o comando "npm install"
- Rode o comando ng serve para instalar

#Observações do projeto#
- na tela de cadastro do cliente temos a Aba "Cliente" e a aba "Endereço"
- Na Aba Endereço temos uma lista que armazena os endereços até que o mesmo seja enviado para o banco
- Caso a tela seja recarregada, qualquer endereço que não esteja salvo no banco será perdido
- Endereços que estão no campo não são adicionados, neste momento para adicionar um endereço deve-se clicar
no botão "Enviar" e Em seguida voltar para a Aba de cliente e clicar em Cadastrar
- Todos os campos em ambos os cadastros são obrigatórios exceto no cadastro de endereços
com bairro e complemento;
- O Botão busca CEP contém uma regra para buscar dados por uma API pública e preencher os campos,
ele deve retornar caso não tenha dados, e também pode ocorrer de não preencher caso a API esteja indisponível
- O projeto será aberto na porta 4200 ( https://localhost:4200)
- Caso abra em outra porta é interesante verificar as configurações de CORS do Servidor, pois o mesmo está com configurações de porta.
  
#Bons cadastros, utilize o projeto como desejar#
