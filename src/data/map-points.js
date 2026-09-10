/**
 * Pontos oficiais do Mapa Interativo.
 * Planta da propriedade Erva-Mate Pagnussat / Memorial Regional da Erva-Mate.
 * x/y: posição percentual na planta esquemática (0-100).
 */
window.MemorialMapData = {
  title: 'Mapa interativo',
  subtitle: 'Toque em um ponto da planta para conhecer cada espaço da visita.',
  imageAlt: 'Planta esquemática da propriedade Erva-Mate Pagnussat, São Luís da Mortandade, Marau/RS',
  points: [
    {
      id: 'acesso',
      number: 1,
      name: 'Acesso',
      short: 'São Luís da Mortandade / Marau / RS.',
      detail:
        'A Erva-Mate Pagnussat está localizada praticamente às margens da rodovia RS-324, no quilômetro 90, localidade de São Luís da Mortandade (interior de Marau/RS). Do centro de Passo Fundo/RS, a distância é de cerca de 28,5 km (38 minutos). Do centro de Marau/RS, o deslocamento é de aproximadamente 7,1 km (12 minutos).',
      group: 'producao',
      groupLabel: 'Chegada',
      x: 10,
      y: 62
    },
    {
      id: 'varejo',
      number: 2,
      name: 'Varejo',
      short: 'Erva-Mate Pagnussat e produtos coloniais.',
      detail:
        'No espaço destinado ao varejo é comercializada a Erva-Mate Pagnussat em pacotes de 1kg e ainda produtos coloniais regionais (principalmente provenientes da Rota das Salamarias).',
      group: 'producao',
      groupLabel: 'Produção',
      x: 22,
      y: 48
    },
    {
      id: 'descarga',
      number: 3,
      name: 'Descarga',
      short: 'Primeira etapa da produção.',
      detail:
        'Há na propriedade erveiras nativas e outras que foram plantadas há 40 anos, mas 90% da matéria-prima vem da região. As variedades usadas pela Erva-Mate Pagnussat são: nativa e cambona 4. A primeira etapa da produção que acontece no local, portanto, é o recebimento dos galhos verdes logo após o processo de poda.',
      group: 'producao',
      groupLabel: 'Produção',
      x: 32,
      y: 62
    },
    {
      id: 'sapeco',
      number: 4,
      name: 'Sapeco',
      short: 'Secagem rápida em chama alta.',
      detail:
        'Galhos e folhas são colocados na sapecadeira, que contém um tambor giratório, onde passam por uma secagem rápida em chama bem alta. Nesta etapa a umidade da matéria-prima é reduzida em cerca de 20%. O processo também é conhecido como tamboreamento e prepara os galhos e as folhas para a etapa seguinte.',
      group: 'producao',
      groupLabel: 'Produção',
      x: 42,
      y: 50
    },
    {
      id: 'barbacua',
      number: 5,
      name: 'Barbacuá',
      short: 'O símbolo da produção artesanal.',
      detail:
        'É no barbacuá que é feita a secagem completa. Folhas e galhos sapecados são colocados em cima de uma grade que recebe o calor do fogo gerado no conduto (forno de tijolos de barro). Em outras palavras: a erva-mate é defumada. É um processo lento, que dura 24 horas, e gera uma quebra de 60% no volume. O fogo é feito a partir de madeiras descartadas de indústrias locais.',
      group: 'producao',
      groupLabel: 'Produção',
      x: 52,
      y: 62
    },
    {
      id: 'cancheada',
      number: 6,
      name: 'Cancheada',
      short: 'Tritura grossa da erva-mate.',
      detail:
        'No cancheador, acontece a primeira tritura do produto, a chamada tritura grossa. Esta operação, no passado, era feita de forma manual com golpes de facões de madeira. No Memorial Regional da Erva-Mate você pode ver exemplares desses facões, feitos em madeira de angico, que por muitos anos foram utilizados pelo senhor Vitorino Pagnussat.',
      group: 'producao',
      groupLabel: 'Produção',
      x: 62,
      y: 50
    },
    {
      id: 'soque',
      number: 7,
      name: 'Soque',
      short: 'Moagem feita por pilões.',
      detail:
        'A Erva-Mate Pagnussat faz atualmente apenas a moagem média padrão. São 30 minutos no soque, feito através de pilões movidos por motor elétrico. Também conhecida como moagem, essa etapa já foi feita na beira do rio utilizando pilão movido por roda d\'água. Para finalizar o processo, ocorrem o peneiramento e a embalagem.',
      group: 'producao',
      groupLabel: 'Produção',
      x: 72,
      y: 62
    },
    {
      id: 'eventos',
      number: 8,
      name: 'Complexo de Eventos',
      short: 'Salão principal e espaço ao ar livre.',
      detail:
        'O salão de festas principal, totalmente equipado e com arquitetura que valoriza o evento, tem capacidade para receber 120 pessoas. Há ainda outro ambiente coberto, ao ar livre, com churrasqueira, mesas e cadeiras.',
      group: 'lazer',
      groupLabel: 'Lazer',
      x: 86,
      y: 24
    },
    {
      id: 'futebol',
      number: 9,
      name: 'Campo de Futebol 7',
      short: 'Espaço esportivo disponível aos visitantes.',
      detail: '',
      group: 'lazer',
      groupLabel: 'Lazer',
      x: 94,
      y: 36
    },
    {
      id: 'volei',
      number: 10,
      name: 'Quadra de Vôlei',
      short: 'Espaço esportivo disponível aos visitantes.',
      detail: '',
      group: 'lazer',
      groupLabel: 'Lazer',
      x: 86,
      y: 46
    },
    {
      id: 'parquinho',
      number: 11,
      name: 'Parquinho',
      short: 'Mais de 10 brinquedos para as crianças.',
      detail: '',
      group: 'lazer',
      groupLabel: 'Lazer',
      x: 94,
      y: 56
    },
    {
      id: 'acervo',
      number: 12,
      name: 'Acervo Rosa e Vitorino Pagnussat',
      short: 'Raízes familiares preservadas.',
      detail:
        'Espaço que registra a tradição da Família Pagnussat na produção artesanal da erva-mate. Uma tradição cultivada há gerações que é contada através de objetos cheios de significado selecionados com muito afeto.',
      group: 'memoria',
      groupLabel: 'Memória',
      x: 74,
      y: 80
    },
    {
      id: 'ludica',
      number: 13,
      name: 'Estação Lúdica',
      short: 'Aprendizado de forma prática e divertida.',
      detail:
        'Ambiente criado para simular, de forma interativa, prática e divertida, o processo de produção artesanal da Erva-Mate Pagnussat. Não importa a idade. Qualquer pessoa pode vivenciar essa experiência.',
      group: 'memoria',
      groupLabel: 'Memória',
      x: 58,
      y: 84
    },
    {
      id: 'trilha-arroio',
      number: 14,
      name: 'Trilha Ecológica Arroio Mortandade',
      short: 'Percorrida a pé pelo visitante.',
      detail:
        'O visitante percorre a pé 665 metros, passando por mata nativa com erveiras, araucárias e outras dezenas de espécies. Contempla uma pequena gruta e duas nascentes. Há ainda vestígios de 11 casas subterrâneas que eram as moradias de indígenas que habitavam a região.',
      group: 'natureza',
      groupLabel: 'Natureza',
      x: 18,
      y: 18
    },
    {
      id: 'trilha-carretao',
      number: 15,
      name: 'Trilha Ecológica Trator e Carretão',
      short: 'Percorrida neste peculiar meio de transporte.',
      detail:
        'O visitante percorre cerca de 800 metros, utilizando esse peculiar meio de transporte (carretão puxado por trator) que, por si só, já torna o passeio interessante. No caminho avistam-se araucárias e árvores de pitanga, uvaia, guavirova, angico, cabriúva, guajuvira. Destaque para uma árvore canjerana com tronco de 2 metros. Com sorte, também poderá ver pássaros e outros animais como jacus, cutias, veados.',
      group: 'natureza',
      groupLabel: 'Natureza',
      x: 38,
      y: 22
    },
    {
      id: 'residencia',
      number: 16,
      name: 'Residência da Família',
      short: 'Residência do casal Regicelene e Adelar Pagnussat.',
      detail: '',
      group: 'familia',
      groupLabel: 'Família',
      x: 22,
      y: 84
    }
  ]
};
