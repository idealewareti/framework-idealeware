# Trabalhando com Angular 

## O que ser� necess�rio instalar:

NodeJS
https://nodejs.org/en/

Angular CLI (Compilador oficial do Angular 4), ap�s o NodeJS instalado digite no Terminal/Prompt de Comando
> `npm install -g @angular/cli`

Visual Studio Code
https://code.visualstudio.com/


## A estrutura do projeto

O nosso frontend segue o seguinte padr�o:

Pasta/Arquivo            | Descri��o
------------------------ | ------------------------------------------------------------------------------------
/dist 						       |    _Arquivos compilados do projeto. Criada quando o projeto for compilado_
/node_modules 					 |			_Depend�ncias do projeto. Criado quando o NPM baixar as depend�ncias_
/package.json						 |			_Configura��es dos pacotes do NodeJS no projeto_
/src										 |			_Todo c�digo-fonte_
/src/app 								 |			_Aonde todo o c�digo fonte se encontra_
/src/app/app.component.ts| 		_Componente principal do projeto_
/src/app/app.config 		 |			_Configura��es do cliente_
/src/app/app.module.ts 	 |			_M�dulo do projeto, importa todos os m�dulos, servi�os, componentes, etc_
/src/app/index.html			 |		_P�gina do projeto_
/src/app/components      |     _Componentes do projeto_
/src/app/managers   |   _Gerenciadores de funcionalidades_
/src/app/services        |     _Providers do projetos que ir�o se comunicar com as API's_
/src/app/views 					 |			_HTML das views dos componentes_
/src/assets			 				 |			_Arquivos est�ticos: , Imagens e etc_
/src/scripts                   |       _Scripts adicionais da loja_
/src/styles                   |       _Estilos CSS da loja_
/src/app/template       |   _Template da loja: HTML e folhas de estilo SASS_


## Iniciando um server Angular para desenvolvimento

Pelo Powershell ou Prompt de Comando, entre na pasta do projeto, e execute os comandos:

Para baixar as depend�ncias do projeto
> `npm install`

Para iniciar o servidor. O caminho padr�o que estamos usando �: http://localhost:4200
> `ng serve` 

## Gerando a publica��o

Para publica��o, basta digitar no terminal 
> `npm run build:ssr`

Para visualizar uma loja rodando com Server-Side Rendering (Angular Universal)
(Este comando necessita que a publica��o seja gerada e ir� ser executado em http://localhost na porta definida em app.config.ts)
> `npm run serve:ssr`