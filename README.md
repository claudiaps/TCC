# TCC-1

## Overview

- Os arquivos estão distribuidos em 2 pastas, *code* e *data* . A pasta *code* contém os códigos do projeto, e a *data* os arquivos de saída.
- Todos os códigos estão configurados para acessar os arquivos dentro da pasta *data*, sendo necessário mudar o caminho no código caso necessário acessar outros arquivos.
- Os códigos estão usando a versão 3 da linguagem Python e a linguagem R em sua versão mais nova (juntamente com a IDE RStudio)

## Instalação

- Para a geração dos arquivos intermediários e da planilha *CSV*, a única biblioteca necessária é a [PyGithub](https://github.com/PyGithub/PyGithub), para instalá-la:
```
$ pip3 install PyGithub
```
- Para plotar a visualização é importante instalar a biblioteca [*streamgraph*](https://github.com/hrbrmstr/streamgraph)  para a linguagem R. Instruções de instalação da biblioteca streamgraph usando a biblioteca devtools (https://hrbrmstr.github.io/streamgraph).


## Execução 

- O primeiro arquivo a ser executado é o *get_API_data.py*. Este é responsável por fazer as requisições para a API do GitHub e coletar as informações sobre as *issues* de determinado repositório. 
    - Para mudar o repositório, basta alterar na linha 5. **Importante**, este campo deve ser no formato *'nome_dono/nome_repo'*
- Após a coleta dos dados do GitHub, deve ser executado o arquivo *get_aux_json.py*, o qual gera um arquivo json intermediário para facilitar o preenchimento da tabela em formato *CSV*
- Com isso, basta executar o arquivo *get_sheet.py*, o qual irá gerar a tabela em *CSV*
- Para plotar a visualização é necessário executar o arquivo *script.R*

## Observações

- A princípio o código está com alguns problemas para pegar informações de mais de um repositório ao mesmo tempo. Esses são:
    - Número máximo de requests permitidos pela API do GitHub
    - Pendência na adaptação dos outros 2 arquivos de código intermediários para tal funcionalidade
