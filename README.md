# Trabalhando com Angular 

## O que será necessário instalar:

NodeJS
https://nodejs.org/en/

Angular CLI (Compilador oficial do Angular 4), após o NodeJS instalado digite no Terminal/Prompt de Comando
> `npm install -g @angular/cli`

Visual Studio Code
https://code.visualstudio.com/


## A estrutura do projeto

O nosso frontend segue o seguinte padrão:

Pasta/Arquivo            | Descrição
------------------------ | ------------------------------------------------------------------------------------
/dist 						       |    _Arquivos compilados do projeto. Criada quando o projeto for compilado_
/node_modules 					 |			_Dependências do projeto. Criado quando o NPM baixar as dependências_
/package.json						 |			_Configurações dos pacotes do NodeJS no projeto_
/src										 |			_Todo código-fonte_
/src/app 								 |			_Aonde todo o código fonte se encontra_
/src/app/app.component.ts| 		_Componente principal do projeto_
/src/app/app.config 		 |			_Configurações do cliente_
/src/app/app.module.ts 	 |			_Módulo do projeto, importa todos os módulos, serviços, componentes, etc_
/src/app/index.html			 |		_Página do projeto_
/src/app/components      |     _Componentes do projeto_
/src/app/managers   |   _Gerenciadores de funcionalidades_
/src/app/services        |     _Providers do projetos que irão se comunicar com as API's_
/src/app/views 					 |			_HTML das views dos componentes_
/src/assets			 				 |			_Arquivos estáticos: , Imagens e etc_
/src/scripts                   |       _Scripts adicionais da loja_
/src/styles                   |       _Estilos CSS da loja_
/src/app/template       |   _Template da loja: HTML e folhas de estilo SASS_


## Iniciando um server Angular para desenvolvimento

Pelo Powershell ou Prompt de Comando, entre na pasta do projeto, e execute os comandos:

Para baixar as dependências do projeto
> `npm install`

Para iniciar o servidor. O caminho padrão que estamos usando é: http://localhost:4200
> `ng serve` 

## Gerando a publicação

Para publicação, basta digitar no terminal 
> `npm run build:ssr`

Para visualizar uma loja rodando com Server-Side Rendering (Angular Universal)
(Este comando necessita que a publicação seja gerada e irá ser executado em http://localhost na porta definida em app.config.ts)
> `npm run serve:ssr`

## Testes da loja

Antes do envio do layout personalizado para atualização na AWS é de responsabilidade do parceiro realizar testes básicos que são considerados como críticos para a loja virtual como:
* Navegação entre as páginas da loja virtual
* Cadastrar um novo cliente
* Realizar uma simulação de frete
* Efetivar uma compra com cartão de crédito e boleto