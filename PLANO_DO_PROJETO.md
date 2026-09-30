# Plano do Projeto - Museu da Erva-Mate

## 1. Objetivo da primeira fase

Criar um prototipo navegavel de alta fidelidade para validacao com o cliente, disponivel em dois modos de uso:

- **Totem interativo:** tela cheia, navegacao por toque, interface de leitura rapida e retorno automatico a tela inicial por inatividade.
- **Website publico:** mesma narrativa e conteudo-base, adaptados para computador, tablet e celular.

Nesta fase, o foco e aprovar a experiencia, a arquitetura de informacao, a linguagem visual e as interacoes. O prototipo usara conteudo demonstrativo onde o acervo final ainda nao estiver disponivel.

## 2. Escopo validado pelo memorial

| Modulo | Objetivo | Prioridade para o prototipo |
| --- | --- | --- |
| Inicio / convite a exploracao | Apresentar o Museu e orientar o visitante | Essencial |
| Linha do tempo interativa | Contar a historia da erva-mate por periodos | Essencial |
| Mapa do espaco clicavel | Permitir explorar os ambientes ou pontos do museu | Essencial |
| Mate pelo Pampa | Conteudo audiovisual com player de audio | Essencial |
| Jogo educativo | Interacao de arrastar e soltar, acerto e comemoracao | Essencial |
| Navegacao e acessibilidade | Garantir orientacao, retorno e uso confortavel | Essencial |
| CMS, API, banco de dados e hospedagem | Gerenciamento de conteudo e operacao publicada | Fase posterior |

## 3. Limites desta fase

Incluido:

- Interfaces navegaveis em HTML, Tailwind CSS e JavaScript.
- Layout responsivo e modo totem simulado.
- Animacoes, transicoes, audio demonstrativo e jogo funcional com dados locais.
- Conteudo provisório claramente separado em arquivos de dados para futura substituicao.
- Validacao em navegadores modernos e tamanhos de tela representativos.

Fora do escopo, conforme o memorial:

- Compra, instalacao ou manutencao do hardware do totem.
- Producao definitiva de textos, fotos, videos, ilustracoes e audios.
- Hospedagem, servidor, banco de dados e licencas de terceiros.
- Painel administrativo e integracao com API nesta primeira entrega.

## 4. Publicos e cenarios de uso

### Visitante no museu

- Usa o totem em pe e por toque.
- Precisa entender a proxima acao sem instrucoes extensas.
- Pode interromper a navegacao a qualquer instante; por isso, inicio e retorno devem ser imediatos.

### Visitante remoto

- Acessa pelo celular ou computador.
- Navega por rolagem, clique e teclado.
- Pode ouvir os audios com controles convencionais e retomar a exploracao quando desejar.

### Mediador / equipe do museu

- Precisa demonstrar rapidamente cada modulo.
- Na fase futura, devera substituir conteudos sem alterar o codigo.

## 5. Arquitetura de informacao e paginas

```text
Inicio
|- Conheca o Museu
|- Linha do Tempo
|  |- Periodo / acontecimento (detalhe)
|- Mapa Interativo
|  |- Ambiente ou ponto do mapa (detalhe)
|- Mate pelo Pampa
|  |- Faixa / historia em audio
|- Jogo da Erva-Mate
|  |- Instrucoes
|  `- Resultado e jogar novamente
`- Sobre / creditos (opcional para a validacao)
```

### Paginas e entregas

1. **Inicio** - chamada principal, caminhos de exploracao e instrucoes breves de toque.
2. **Linha do tempo** - navegacao por periodos, cartoes de acontecimentos e area de detalhe.
3. **Mapa interativo** - mapa ilustrado com pontos selecionaveis, painel de descricao e destaque visual do item ativo.
4. **Mate pelo Pampa** - selecao de conteudos, player de audio, duracao e contexto da faixa.
5. **Jogo educativo** - desafio drag-and-drop, validacao de resposta, progresso, placar e celebracao.
6. **Tela de inatividade do totem** - convite visual para tocar e recomecar a experiencia.

## 6. Diretrizes de experiencia

### Para o totem

- Resolucao-base a definir apos confirmacao do equipamento; adotar inicialmente um canvas de referencia de 1920 x 1080 em modo retrato.
- Areas de toque grandes (minimo recomendado de 48 x 48 px; preferencialmente maiores nos controles principais).
- Sem informacao essencial apenas no efeito de hover.
- Botao Inicio sempre visivel e retorno automatico apos um periodo configuravel de inatividade.
- Animacoes curtas, com proposito e sem impedir a proxima acao do visitante.

### Para web

- Navegacao responsiva com menu apropriado a telas pequenas.
- Conteudo acessivel por teclado; foco visivel; textos alternativos e rotulos nos controles.
- Audio sem inicio automatico com som e com controles nativos/complementares claros.
- Respeito a preferencia de reducao de movimento do dispositivo.

## 7. Direcao tecnica do prototipo

### Base

- HTML semantico por pagina ou secoes.
- Tailwind CSS para layout, responsividade, tokens visuais e estados.
- JavaScript modular (ES Modules) para navegacao, dados, interacoes e estado do jogo.
- Dados locais em JSON ou modulos JavaScript para timeline, pontos do mapa, faixas e fases do jogo.

### Bibliotecas sugeridas

| Necessidade | Opcao | Uso planejado |
| --- | --- | --- |
| Animacoes | GSAP | Entradas de secao, transicoes de tela e feedback do jogo |
| Gestos / arrastar e soltar | SortableJS ou interacao nativa Pointer Events | Jogo com suporte a mouse e toque |
| Icones | Lucide | Iconografia leve e consistente |
| Audio | HTMLAudioElement | Player leve, sem dependencia adicional |

A escolha final de biblioteca de drag-and-drop deve ser validada em dispositivo de toque real antes de congelar a implementacao.

### Estrutura proposta

```text
/
|- index.html
|- timeline.html
|- mapa.html
|- pampa.html
|- jogo.html
|- src/
|  |- js/
|  |  |- app.js
|  |  |- navigation.js
|  |  |- totem-idle.js
|  |  |- timeline.js
|  |  |- map.js
|  |  |- audio-player.js
|  |  `- game.js
|  |- data/
|  |  |- timeline.js
|  |  |- map-points.js
|  |  |- pampa-tracks.js
|  |  `- game-levels.js
|  `- css/
|     `- input.css
|- public/
|  |- images/
|  |- audio/
|  `- icons/
`- tailwind.config.js
```

## 8. Plano de trabalho por etapas

### Etapa 0 - Kickoff e definicao de escopo

**Objetivo:** transformar o memorial em decissoes objetivas de produto.

- Confirmar nome oficial, tom institucional e identidade visual existente.
- Confirmar dimensoes, orientacao e sistema operacional do totem.
- Mapear quais conteudos existem, quem os fornece e em qual formato.
- Definir quais ambientes ou pontos aparecem no mapa e quais periodos integram a linha do tempo.
- Definir regra pedagogica do jogo: itens, categorias, acertos e feedback.

**Saida:** documento de escopo aprovado e inventario de conteudo.

### Etapa 1 - Arquitetura de experiencia

**Objetivo:** aprovar os caminhos de navegacao antes do design detalhado.

- Criar fluxos do totem e do website.
- Definir hierarquia de conteudo e wireframes das seis telas/modulos.
- Especificar estados: carregando, vazio, erro de audio, resposta certa/errada e inatividade.

**Saida:** wireframes navegaveis e mapa de fluxos aprovados.

### Etapa 2 - Direcao visual

**Objetivo:** estabelecer uma linguagem coerente com o Museu da Erva-Mate.

- Definir paleta, tipografia, grades, icones, ilustracoes e textura visual.
- Criar design system minimo: botoes, cartoes, navegacao, modal/painel, player e feedback do jogo.
- Produzir duas telas-chave em alta fidelidade: Inicio e uma tela de modulo.

**Saida:** guia visual compacto e telas-chave aprovadas.

### Etapa 3 - Prototipo funcional em HTML/Tailwind/JavaScript

**Objetivo:** materializar a experiencia para demonstracao ao cliente.

- Construir estrutura compartilhada, navegacao e modo totem.
- Implementar Linha do Tempo e Mapa Interativo.
- Implementar Mate pelo Pampa com player.
- Implementar Jogo drag-and-drop com feedback completo.
- Aplicar responsividade e animacoes.

**Saida:** prototipo navegavel local, com dados demonstrativos editaveis.

### Etapa 4 - Validacao com cliente

**Objetivo:** tomar decisoes antes do investimento em backend e conteudo final.

- Realizar demonstracao guiada pelos cenarios de uso.
- Registrar feedback por modulo: manter, ajustar ou descartar.
- Priorizar ajustes em experiencia e conteudo.
- Consolidar uma versao aprovada para a proxima fase.

**Saida:** ata de validacao, lista priorizada de ajustes e aceite do prototipo.

### Etapa 5 - Preparacao da fase de producao

**Objetivo:** converter o prototipo aprovado em produto operavel.

- Definir CMS/API/banco de dados apenas se a gestao dinamica de conteudo for confirmada.
- Integrar acervo final e direitos de uso de midias.
- Preparar hospedagem, operacao do totem, telemetria opcional e plano de manutencao.

**Saida:** backlog tecnico de producao e estimativa revisada.

## 9. Criterios de aceite do prototipo

- Todas as paginas principais podem ser acessadas e retornam ao inicio sem bloqueios.
- Linha do tempo exibe periodos e detalhes demonstrativos.
- Mapa permite selecionar todos os pontos cadastrados e abrir seus detalhes.
- Player reproduz, pausa e permite trocar faixas demonstrativas.
- Jogo aceita interacao por mouse e toque simulado, informa acerto/erro e permite recomecar.
- Em modo totem, a interface pode ser usada sem hover e volta ao atrativo inicial por inatividade.
- Em web, o layout permanece legivel e navegavel em celular, tablet e desktop.
- Conteudo temporario pode ser substituido sem reestruturar as telas.

## 10. Decisoes necessarias antes do inicio do design

1. Qual e a resolucao, orientacao e navegador/sistema do totem?
2. Existe marca, manual de identidade ou referencias visuais obrigatorias do Museu?
3. Quais conteudos ja estao disponiveis (textos, fotos, audios, videos e mapa)?
4. O mapa representa o espaco fisico do museu, o territorio do Pampa ou ambos?
5. Qual e a faixa etaria principal e qual aprendizado o jogo deve reforcar?
6. O site devera ter apenas a experiencia institucional ou tambem agenda, contato e informacoes de visita?
7. Quais pessoas aprovam experiencia, visual e conteudo, e em que ordem?

## 11. Riscos e como tratar

| Risco | Tratamento |
| --- | --- |
| Conteudo final atrasar | Usar estrutura de dados e placeholders desde o inicio; aprovar a experiencia independente do acervo final |
| Hardware ainda indefinido | Projetar em resolucao-base e reservar etapa de calibracao no equipamento real |
| Drag-and-drop falhar no toque | Testar em dispositivo cedo e manter alternativa por toque: selecionar item e destino |
| Escopo crescer durante a validacao | Registrar novas ideias como backlog e preservar o objetivo de aprovar o nucleo do prototipo |
| Audio sem licenca ou indisponivel | Usar faixas demonstrativas no prototipo e exigir comprovacao de direitos antes da publicacao |

## 12. Proximo passo imediato

Realizar a Etapa 0 em uma reuniao curta de definicao. Em seguida, produzir o fluxo de navegacao e wireframes de Inicio, Linha do Tempo, Mapa, Mate pelo Pampa e Jogo. Somente apos esse aceite inicia-se a codificacao do prototipo em HTML, Tailwind CSS e JavaScript.

## 13. Ajustes temporarios (restaurar no final do projeto)

### Idle "Toque para comecar" (`app.js`)

| Estado | Comportamento |
| --- | --- |
| **Atual (temporario)** | Com o overlay aberto, so some com **clique/toque** na tela "Toque para comecar". Passar o mouse por cima (`pointermove`) nao fecha. Flag: `IDLE_DISMISS_CLICK_ONLY = true`. |
| **Original (restaurar no fim)** | Qualquer atividade do usuario (`pointerdown`, `pointermove`, `keydown`, `touchstart`, `scroll`) deve fechar o overlay e reiniciar o timer de inatividade. Definir `IDLE_DISMISS_CLICK_ONLY = false` (ou remover a flag e voltar `resetIdle` a sempre chamar `hideIdle`). |

Motivo do ajuste temporario: em desenvolvimento no desktop, o hover/movimento do mouse fechava o atrativo sem clique intencional, atrapalhando testes e demonstracao.
