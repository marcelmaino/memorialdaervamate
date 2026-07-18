/**
 * Pontos demonstrativos do Mapa Interativo.
 * Substituir por coordenadas e textos oficiais do Memorial.
 * x/y: posição percentual no mapa (0-100).
 */
window.MemorialMapData = {
  title: 'Mapa interativo',
  subtitle: 'Toque em um ponto para conhecer ambientes e lugares da Rota das Salamarias.',
  image: 'public/images/rota.jpg',
  imageAlt: 'Mapa ilustrado da Rota das Salamarias, região de Marau',
  points: [
    {
      id: 'memorial',
      number: 1,
      name: 'Memorial Regional',
      short: 'Casa da memória da erva-mate em Marau.',
      detail:
        'Ponto central da experiência. Aqui o visitante encontra narrativas, objetos e caminhos para explorar a história da erva-mate. Conteúdo demonstrativo para validação do painel e do toque no totem.',
      tags: ['Memorial', 'Marau'],
      x: 48,
      y: 42
    },
    {
      id: 'erval',
      number: 2,
      name: 'Erval nativo',
      short: 'Paisagem, folhas e o ciclo da planta.',
      detail:
        'Placeholder para conteúdos sobre ervais, floresta e relação com o território. Na versão final, pode reunir fotos de acervo, legendas e indicações de visitação ou interpretação ambiental.',
      tags: ['Natureza', 'Erva-mate'],
      x: 22,
      y: 28
    },
    {
      id: 'salamaria',
      number: 3,
      name: 'Salamaria',
      short: 'Trabalho, secagem e ofício da folha.',
      detail:
        'Espaço reservado para explicar o processo produtivo nas salamarias: colheita, sapeco, secagem e preparo. Textos e imagens oficiais substituirão este bloco após o inventário do Memorial.',
      tags: ['Trabalho', 'Ofício'],
      x: 72,
      y: 34
    },
    {
      id: 'rota',
      number: 4,
      name: 'Rota das Salamarias',
      short: 'Caminhos que ligam gente, mate e território.',
      detail:
        'Ponto demonstrativo sobre a rota como eixo cultural e turístico. Pode indicar outros atrativos da região e conectar o mapa físico do museu ao território ampliado.',
      tags: ['Rota', 'Território'],
      x: 64,
      y: 68
    },
    {
      id: 'roda',
      number: 5,
      name: 'Roda de mate',
      short: 'Encontro, conversa e pertencimento.',
      detail:
        'Área prevista para práticas culturais contemporâneas: a roda de chimarrão, hospitalidade e memória viva. Ideal para cruzar com o módulo Mate pelo Pampa na fase seguinte.',
      tags: ['Cultura', 'Encontro'],
      x: 30,
      y: 72
    }
  ]
};
