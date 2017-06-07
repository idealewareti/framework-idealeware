# Trabalhando com Angular 2 e Angular 4

## O que será necessário instalar:

NodeJS
https://nodejs.org/en/

Angular CLI (Compilador oficial do Angular 4)
`npm install -g @angular/cli`

Visual Studio Code
https://code.visualstudio.com/

Extensão Beast Code do VS Code (Opcional)
No Visual Studio Code, aperte *Ctrl P* para abrir o prompt e digite
`ext install Angular-BeastCode`


## A estrutura do projeto

O nosso frontend segue o seguinte padrão:

/dist 						    _Arquivos compilados do projeto. Criada quando o projeto for compilado_

/node_modules 				_Dependências do projeto. Criado quando o NPM baixar as dependências_

/src
--/app 							_Aonde todo o código fonte se encontra_

-- --/app.component.ts 			_Componente principal do projeto_

-- --/app.config 				_Configurações do cliente_
-- --/app.module.ts 			_Módulo do projeto, importa todos os módulos, serviços, componentes, etc_

-- --/app.routes.ts 			_Rotas do projeto_

-- --/app.settings.ts 			_Configurações essenciais do projeto. Caminho das API's_

-- --/index.html				_Página do projeto_

-- --/components                _Componentes do projeto_
-- --/services                  _Providers do projetos que irão se comunicar com as API's_

-- --/styles    				_Folhas de estilo dos componentes_

-- --/views 					_HTML das views dos componentes_
--/assets 						_Arquivos estáticos: CSS, Imagens e JS_

--/package.json					_Configurações dos pacotes do projeto_


## Iniciando um server Node

Pelo Powershell ou Prompt de Comando, entre na pasta do projeto, e execute os comandos:

`npm install`

ou

`npm link`

Para baixar as dependências do projeto

`ng serve`

Para iniciar o servidor. O caminho padrão que estamos usando é: http://localhost:4200

## Gerando a publicação

Para publicação, basta digitar no terminal

`ng build`
