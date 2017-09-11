# Trabalhando com Angular 4.x

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
/src/app/app.routes.ts 	 |			_Rotas do projeto_
/src/app/app.settings.ts |			_Configurações essenciais do projeto. Caminho das API's_
/src/app/index.html			 |		_Página do projeto_
/src/app/components      |     _Componentes do projeto_
/src/app/services        |     _Providers do projetos que irão se comunicar com as API's_
/src/app/styles    			 |			_Folhas de estilo dos componentes_
/src/app/views 					 |			_HTML das views dos componentes_
/src/assets			 				 |			_Arquivos estáticos: CSS, Imagens e JS_


## Iniciando um server Angular para desenvolvimento

Pelo Powershell ou Prompt de Comando, entre na pasta do projeto, e execute os comandos:

Para baixar as dependências do projeto
> `npm install`

Para iniciar o servidor. O caminho padrão que estamos usando é: http://localhost:4200
> `ng serve` 

## Gerando a publicação

Para publicação, basta digitar no terminal 
> `ng build --prod`
