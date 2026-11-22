---
id: atelie-wire-mono-single-screen
version: 1.0.0
status: especificacao-proposta-para-reuso
language: pt-BR
reference: OST_Tela_Unica_Wireframe.png
reference_dimensions_px: 1536x1024
scope: wireframes-de-uma-tela; nao-design-system-final
---

# Modelo de wireframe — monocromático, baixa fidelidade, tela única

## 1. Para que serve

Este documento transforma a direção visual do wireframe da OST gerado nesta conversa em um contrato reutilizável para novos pedidos. O objetivo é manter **forma, linguagem visual, densidade e comportamento básico**, sem obrigar todo novo conteúdo a ser uma OST.

O arquivo de referência é `OST_Tela_Unica_Wireframe.png`, gerado em 1536×1024px, proporção 3:2. O briefing anterior indicava uma dimensão aproximada maior; o arquivo efetivamente gerado tem essas dimensões. Para padronizar a partir de agora,1536×1024 é o alvo de referência.

As medidas,cores e tokens abaixo são uma especificação normativa proposta para reproduzir a direção visual. Não são uma medição pixel a pixel da imagem, nem promessa de que um gerador de imagens respeitará coordenadas ou textos com exatidão.

### Duas camadas de reuso

1. **Estilo-base:** tela única,monocromática,baixa fidelidade,tipografia simples,controles contidos,hierarquia evidente e exemplos identificados.
2. **Receita de composição:** organização adequada ao assunto. `ost_five_bands` é a receita da árvore;outros assuntos podem usar outra composição sem perder o estilo-base.

Não confundir “árvore visualmente preenchida” com pesquisa concluída,hipótese validada ou todos os nós aprovados.

## 2. Princípios obrigatórios

- Uma única tela principal,sem colagem de telas ou mockup de dispositivo.
- Preto,branco e cinzas;sem cor de marca ou sinalização dependente de cor.
- Wireframe de baixa fidelidade,não interface final de marketing.
- Texto legível e relações claras têm prioridade sobre quantidade de elementos.
- Conteúdo plausível e concreto;sem usar loremipsum como substituto de decisões de estrutura.
- Sem fotografias,ilustrações decorativas,gradientes,glow,texturas ou sombras.
- Poucas ações,ligadas à tarefa principal;sem editor completo disfarçado de wireframe.
- Distinguir proposta de interação de funcionalidade executada.
- Dados inventados recebem selo visível `EXEMPLO FICTÍCIO`;não inventar resultado de teste ou citação real.

## 3. Quadro,grid e zonas

### Quadro padrão

| Propriedade | Padrão proposto |
|---|---|
| Alvo |1536×1024px |
| Proporção |3:2, desktop horizontal |
| Telas |Uma |
| Moldura de dispositivo |Não |
| Margem externa |24px |
| Unidade de espaçamento |8px |
| Intervalos usuais |8,16,24,32px |
| Alinhamento |Grid consistente,sem desalinhamento decorativo |

As dimensões são alvo de geração. Se o renderizador só oferecer outra resolução,registrar o tamanho entregue e preservar a proporção sempre que possível. Não anunciar conformidade pixel-perfect sem medição.

### Zonas verticais

1. **Cabeçalho:** identificação discreta do produto/área e selo de natureza do exemplo.
2. **Título e subtítulo:** contexto da tarefa,não propaganda.
3. **Barra de controles:** apenas ações básicas de inspeção/navegação.
4. **Área principal:** mapa,estrutura ou conteúdo central e,se necessário,painel lateral.
5. **Rodapé de comportamento:** frase curta sobre interações previstas ou implementadas.

Alturas iniciais orientativas:cabeçalho48px;título/subtítulo72px;toolbar48px;rodapé40px. A área central ocupa o restante. Não encolher texto para cumprir uma altura artificial.

### Área central com inspetor

- Referência:78% para o conteúdo principal e22% para o inspetor,descontadas as margens externas.
- Uma linha vertical separa as regiões.
- O painel não cobre o mapa,não é modal e não provoca troca de tela.
- Intervalo aceitável no contrato:70–85%para o principal e15–30%para o inspetor;as duas porcentagens devem somar100.
- Sem inspetor,o conteúdo ocupa a largura central disponível;esse é outro estado da mesma tela,não uma segunda tela desenhada ao lado.

## 4. Tokens visuais

### Paleta proposta

| Token | Valor | Uso |
|---|---|---|
| `canvas` |`#FFFFFF` |Fundo principal |
| `surface_subtle` |`#F5F5F5` |Faixas ou agrupamentos discretos |
| `surface_selected` |`#EEEEEE` |Apoio opcional à seleção,sem depender dele |
| `ink` |`#171717` |Texto principal |
| `ink_muted` |`#5A5A5A` |Metadados e notas |
| `border` |`#808080` |Contornos de cartões/controles |
| `divider` |`#D0D0D0` |Separadores não essenciais |
| `connector` |`#707070` |Conectores entre nós |
| `focus` |`#000000` |Foco de teclado no protótipo |

Não usar cinza-claro para texto essencial. Essa lista é proposta de tokens,não auditoria de contraste ou certificaçãoWCAG. Verificar contraste,zoom,foco e legibilidade na implementação real.

### Tipografia

- Família:sans-serif de sistema,como Arial/Helvetica/sans-serif;sem fonte de marca obrigatória.
- Título:24–28px,peso 600.
- Títulos de painel:18–20px,peso 600.
- Conteúdo dos cartões:14–16px,peso 400 ou 500.
- Metadados/faixas:12–13px,sem uso excessivo de caixa-alta.
- Entrelinha:aproximadamente1,35–1,5.
- Texto de cartão alinhado à esquerda;sem títulos centralizados em todos os blocos.
- Não baixar texto informativo abaixo de 12px para colocar mais nós. Reduzir escopo com acordo ou mudar o enquadramento explicitamente.

### Formas e contornos

- Cartões retangulares;raio0–4px.
- Borda normal:1px.
- Padding inicial:12–16px.
- Sem sombra ou relevo3D.
- Seleção:borda dupla preta ou contorno duplo equivalente,sem alterar o tamanho/alinhamento do cartão.
- Foco de teclado:contorno separado da seleção;nó selecionado não é sinônimo de elemento focado.
- Botões em contorno,sem gradiente,com texto curto e significado explícito.

## 5. Cartões e densidade

Um cartão contém,no máximo:

1. Identificação de tipo/ID discreta,quando necessária.
2. Título curto e concreto.
3. Estado textual curto,quando houver.
4. Controle de recolhimento,apenas se tiver filhos.

Descrições longas,fontes,justificativas e ações secundárias pertencem ao painel lateral. Não colocar parágrafos completos em todos os cartões.

Sugestão de densidade:até 22 nós neste exemplo e teto inicial de 30 nós no contrato. Não é um limite metodológico deOST,nem garantia de que 30 nós sempre cabem. Se faltar espaço,priorizar legibilidade e revisar o recorte sem apagar conteúdo silenciosamente.

Para imagem estática da receita OST,o mapa principal deve caber inteiro no quadro de referência. Para protótipo navegável maior,zoom/pan podem ser uma extensão explicitamente pedida;não mudar a regra de “mapa todo visível”por conta própria.

## 6. Conectores e hierarquia

- Conectores ortogonais,com caminhos previsíveis e sem setas nesta receita.
- Saída pela base do pai e chegada pelo topo do filho.
- Mesmo padrão de linha e terminação em toda a tela.
- Linhas atrás dos cartões,nunca atravessando texto.
- Evitar cruzamentos e longos trajetos que confundam o pai de cada nó.
- Preservar alinhamento de colunas quando um mesmo caminho segue por níveis diferentes.
- Proximidade visual não substitui conexão explícita.
- Relações compartilhadas/cross-links só entram quando solicitadas e com convenção própria;este exemplo é uma árvore simples.

## 7. Receita específica: `ost_five_bands`

### Cinco faixas horizontais

1. `RESULTADO`.
2. `OPORTUNIDADES`.
3. `SOLUÇÕES`.
4. `SUPOSIÇÕES`.
5. `TESTES`.

Os rótulos aparecem discretamente na margem esquerda;cartões seguem de cima para baixo.

### Distribuição de referência

- Um resultado.
- Três oportunidades.
- Duas soluções por oportunidade:seis colunas.
- Uma suposição por solução:mesmas seis colunas.
- Um teste por suposição:mesmas seis colunas.
- Total:22 nós e21 conexões.

Essa distribuição é **uma composição didática**,não uma regra deTeresa Torres nem uma exigência de que toda solução tenha exatamente uma suposição e um teste. Não gerar relações falsas para preencher simetria.

### Conteúdo do exemplo

Resultado:`Retomar decisões sem perder o contexto`.

Oportunidades:`Encontrar o registro`;`Entender como a decisão foi construída`;`Escolher o que pode circular`.

Oportunidade selecionada:a segunda,com borda dupla. O inspetor mostra sua descrição e referências fictícias. Todos os testes começam com `A realizar`:nenhum resultado empírico foi produzido.

As alternativas são possibilidades,não compromissos ou soluções vencedoras. A árvore preenchida não implica validação de suas interpretações.

## 8. Painel lateral

Ordem de leitura:

1. Título de contexto,por exemplo`Oportunidade selecionada`.
2. Nome completo do nó.
3. Descrição breve.
4. Fontes/referências vinculadas,comIDe natureza.
5. Nota sobre interpretação/proveniência,quando necessária.
6. Ações básicas:`Ver evidências`,`Destacar caminho`.
7. Controle`Fechar painel`,no alto.

Não inventar nomes,pessoas,entrevistas ou citações reais. Uma nota pode sustentar uma interpretação,mas não será automaticamente apresentada entre aspas como fala literal.

O painel não deve virar formulário completo nem editor de projeto neste wireframe.

## 9. Interações básicas e seus contratos

| Ação | Comportamento no protótipo | Fora de escopo |
|---|---|---|
| Selecionar nó |Marca só um nó e atualiza o inspetor,sem trocar de tela. |Abrir uma nova área do aplicativo. |
| Recolher ramo |Oculta descendentes,mostra o estado recolhido e permite reabrir. |Apagar nós ou evidências. |
| Zoom |Altera escala do mapa,não a barra de controles ou o inspetor. |Simular zoom sem alterar nada. |
| Ajustar à tela |Enquadra o mapa visível na área principal. |Prometer mostrar texto legível em qualquer densidade. |
| Ver evidências |Revela no inspetor referências/contexto do nó selecionado. |Publicar,baixar ou enviar entrevistas automaticamente. |
| Destacar caminho |Realça visualmente a ligação do nó aos ancestrais,sem mudar a estrutura. |Reordenar ou priorizar os ramos. |
| Fechar painel |Oculta o inspetor e devolve espaço ao conteúdo. |Navegação para outra tela. |

Não incluir neste primeiro wireframe: arrastar,reordenar,criar/apagar nós,editar texto,gerarIA,importar corpus,colaborar ou publicar.

### Estático versus interativo

- `wireframe_static`:imagemPNG;controles são **interações previstas**,não clicáveis.
- `wireframe_interactive`:HTML;ações declaradas precisam funcionar,com estados/foco correspondentes.

Nunca dizer que uma imagem estática implementa as interações. Para HTML,controles acionáveis devem ter alvos de interação suficientemente amplos,nomes acessíveis e foco visível;testar teclado e não depender só de cor.

## 10. Conteúdo e proveniência

- `synthetic`:dados inventados para testar composição;exigir selo`EXEMPLO FICTÍCIO`.
- `provided`:conteúdo fornecido explicitamente para o pedido;não presumir autorização de divulgação ou completar lacunas com fatos inventados.
- Referências fictícias não contam como evidências empíricas.
- Não usar porcentagens,scores,aprovações ou estado“validado”sem base fornecida.
- Guardar IDs e textos exatos no briefing;no resultado,inspecionar se o gerador preservou acentos,negações,ordem e vínculos.

## 11. O que pode mudar sem quebrar o modelo

Pode mudar:o assunto,título,texto dos cartões,número de faixas/nós conforme a receita,natureza do conteúdo e presença do inspetor.

Preservar:uma tela,baixa fidelidade,grayscale,tipografia simples,hierarquia,conectores consistentes,seleção não dependente de cor,ações básicas e proveniência explícita.

Se o assunto não for hierárquico,usar`custom_single_screen`e descrever a composição específica. Não forçar uma tabela,agenda ou lista para dentro de uma árvore só para imitar a OST. O contrato 1.0é deliberadamente voltado a estruturas de nós/arestas;um componente de tabela/lista pode exigir extensão de schema versionada antes de ser considerado validado.

## 12. JSON Schema proposto

O schema abaixo descreve o **pedido estruturado**,não a imagem. Ele verifica forma,valores e combinações declaradas. Não verifica se pixels,textos,contraste,conectores ou interações do resultado obedecem ao pedido.

Defaults visuais estão definidos nesta especificação e no exemplo. O schema usa campos explícitos;um consumidor não deve presumir que validação preenche valores ausentes automaticamente.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:atelie:wireframe:mono-single-screen:1.0.0",
  "title": "Ateliê — pedido de wireframe monocromático de tela única",
  "description": "Contrato proposto para geração. Validação estrutural não verifica a imagem renderizada nem substitui revisão visual.",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "schema_version": {
      "const": "1.0.0"
    },
    "style_id": {
      "const": "atelie-wire-mono-single-screen"
    },
    "artifact_stage": {
      "type": "string",
      "enum": [
        "wireframe_static",
        "wireframe_interactive"
      ]
    },
    "language": {
      "const": "pt-BR"
    },
    "subject": {
      "type": "string",
      "minLength": 1
    },
    "primary_user_task": {
      "type": "string",
      "minLength": 1
    },
    "layout_recipe": {
      "type": "string",
      "enum": [
        "ost_five_bands",
        "hierarchy_with_inspector",
        "custom_single_screen"
      ]
    },
    "frame": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "screen_count": {
          "const": 1
        },
        "target_width_px": {
          "type": "integer",
          "minimum": 1200,
          "maximum": 2560
        },
        "target_height_px": {
          "type": "integer",
          "minimum": 800,
          "maximum": 1600
        },
        "target_aspect_ratio": {
          "const": "3:2"
        },
        "device_frame": {
          "const": false
        },
        "show_all_primary_content": {
          "const": true
        }
      },
      "required": [
        "screen_count",
        "target_width_px",
        "target_height_px",
        "target_aspect_ratio",
        "device_frame",
        "show_all_primary_content"
      ]
    },
    "style": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "fidelity": {
          "const": "low"
        },
        "palette": {
          "const": "grayscale"
        },
        "typography": {
          "const": "sans_serif"
        },
        "shadows": {
          "const": false
        },
        "gradients": {
          "const": false
        },
        "decorative_illustrations": {
          "const": false
        },
        "selection_cue": {
          "const": "double_border"
        },
        "connector_style": {
          "const": "orthogonal_no_arrows"
        },
        "spacing_unit_px": {
          "const": 8
        }
      },
      "required": [
        "fidelity",
        "palette",
        "typography",
        "shadows",
        "gradients",
        "decorative_illustrations",
        "selection_cue",
        "connector_style",
        "spacing_unit_px"
      ]
    },
    "layout": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "header": {
          "const": true
        },
        "title": {
          "type": "string",
          "minLength": 1
        },
        "subtitle": {
          "type": "string"
        },
        "toolbar": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "zoom_out",
              "zoom_value",
              "zoom_in",
              "fit_to_screen",
              "collapse_branches"
            ]
          },
          "minItems": 0,
          "maxItems": 5
        },
        "main_region_percent": {
          "type": "integer",
          "minimum": 70,
          "maximum": 85
        },
        "inspector": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "visible": {
              "type": "boolean"
            },
            "width_percent": {
              "type": "integer",
              "minimum": 15,
              "maximum": 30
            },
            "title": {
              "type": "string",
              "minLength": 1
            },
            "selected_node_id": {
              "type": [
                "string",
                "null"
              ]
            },
            "actions": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "view_evidence",
                  "highlight_path",
                  "close_inspector"
                ]
              },
              "minItems": 0,
              "maxItems": 3
            }
          },
          "required": [
            "visible",
            "width_percent",
            "title",
            "selected_node_id",
            "actions"
          ]
        },
        "footer_interaction_note": {
          "const": true
        }
      },
      "required": [
        "header",
        "title",
        "subtitle",
        "toolbar",
        "main_region_percent",
        "inspector",
        "footer_interaction_note"
      ]
    },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "nature": {
          "type": "string",
          "enum": [
            "synthetic",
            "provided"
          ]
        },
        "example_badge": {
          "type": "boolean"
        },
        "provenance_note": {
          "type": "string",
          "minLength": 1
        },
        "root_id": {
          "type": "string",
          "minLength": 1
        },
        "bands": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "string",
                "minLength": 1
              },
              "label": {
                "type": "string",
                "minLength": 1
              }
            },
            "required": [
              "id",
              "label"
            ]
          },
          "minItems": 1,
          "maxItems": 6
        },
        "nodes": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "string",
                "minLength": 1
              },
              "kind": {
                "type": "string",
                "enum": [
                  "outcome",
                  "opportunity",
                  "solution",
                  "assumption",
                  "test",
                  "generic"
                ]
              },
              "label": {
                "type": "string",
                "minLength": 1
              },
              "parent_id": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "status": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "evidence_refs": {
                "type": "array",
                "items": {
                  "type": "string",
                  "minLength": 1
                },
                "minItems": 0,
                "maxItems": 20
              }
            },
            "required": [
              "id",
              "kind",
              "label",
              "parent_id",
              "status",
              "evidence_refs"
            ]
          },
          "minItems": 1,
          "maxItems": 30
        },
        "edges": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "from": {
                "type": "string",
                "minLength": 1
              },
              "to": {
                "type": "string",
                "minLength": 1
              }
            },
            "required": [
              "from",
              "to"
            ]
          },
          "minItems": 0,
          "maxItems": 35
        },
        "evidence_items": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "string",
                "minLength": 1
              },
              "label": {
                "type": "string",
                "minLength": 1
              },
              "nature": {
                "type": "string",
                "enum": [
                  "synthetic",
                  "provided"
                ]
              },
              "representation": {
                "type": "string",
                "enum": [
                  "note",
                  "transcript",
                  "interpretation",
                  "document",
                  "unspecified"
                ]
              }
            },
            "required": [
              "id",
              "label",
              "nature",
              "representation"
            ]
          },
          "minItems": 0,
          "maxItems": 30
        },
        "default_test_status": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "nature",
        "example_badge",
        "provenance_note",
        "root_id",
        "bands",
        "nodes",
        "edges",
        "evidence_items",
        "default_test_status"
      ]
    },
    "interactions": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "allowed": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "select_node",
              "collapse_branch",
              "zoom",
              "fit_to_screen",
              "view_evidence",
              "highlight_path",
              "close_inspector"
            ]
          },
          "minItems": 0,
          "maxItems": 7
        },
        "implementation": {
          "type": "string",
          "enum": [
            "annotated_only",
            "working_basic"
          ]
        },
        "edit_nodes": {
          "const": false
        },
        "drag_nodes": {
          "const": false
        },
        "create_or_delete_nodes": {
          "const": false
        }
      },
      "required": [
        "allowed",
        "implementation",
        "edit_nodes",
        "drag_nodes",
        "create_or_delete_nodes"
      ]
    },
    "generation": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "output_format": {
          "type": "string",
          "enum": [
            "png",
            "html"
          ]
        },
        "exact_ui_text": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          },
          "minItems": 1,
          "maxItems": 100
        },
        "text_priority_over_density": {
          "const": true
        },
        "allow_silent_content_reduction": {
          "const": false
        },
        "allow_extra_screens": {
          "const": false
        },
        "notes": {
          "type": "string"
        }
      },
      "required": [
        "output_format",
        "exact_ui_text",
        "text_priority_over_density",
        "allow_silent_content_reduction",
        "allow_extra_screens",
        "notes"
      ]
    }
  },
  "required": [
    "schema_version",
    "style_id",
    "artifact_stage",
    "language",
    "subject",
    "primary_user_task",
    "layout_recipe",
    "frame",
    "style",
    "layout",
    "content",
    "interactions",
    "generation"
  ],
  "allOf": [
    {
      "if": {
        "properties": {
          "artifact_stage": {
            "const": "wireframe_static"
          }
        }
      },
      "then": {
        "properties": {
          "interactions": {
            "properties": {
              "implementation": {
                "const": "annotated_only"
              }
            }
          },
          "generation": {
            "properties": {
              "output_format": {
                "const": "png"
              }
            }
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "artifact_stage": {
            "const": "wireframe_interactive"
          }
        }
      },
      "then": {
        "properties": {
          "interactions": {
            "properties": {
              "implementation": {
                "const": "working_basic"
              }
            }
          },
          "generation": {
            "properties": {
              "output_format": {
                "const": "html"
              }
            }
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "content": {
            "properties": {
              "nature": {
                "const": "synthetic"
              }
            }
          }
        }
      },
      "then": {
        "properties": {
          "content": {
            "properties": {
              "example_badge": {
                "const": true
              }
            }
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "layout_recipe": {
            "const": "ost_five_bands"
          }
        }
      },
      "then": {
        "properties": {
          "content": {
            "properties": {
              "bands": {
                "minItems": 5,
                "maxItems": 5,
                "prefixItems": [
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "id": {
                        "const": "result"
                      },
                      "label": {
                        "const": "RESULTADO"
                      }
                    },
                    "required": [
                      "id",
                      "label"
                    ]
                  },
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "id": {
                        "const": "opportunities"
                      },
                      "label": {
                        "const": "OPORTUNIDADES"
                      }
                    },
                    "required": [
                      "id",
                      "label"
                    ]
                  },
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "id": {
                        "const": "solutions"
                      },
                      "label": {
                        "const": "SOLUÇÕES"
                      }
                    },
                    "required": [
                      "id",
                      "label"
                    ]
                  },
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "id": {
                        "const": "assumptions"
                      },
                      "label": {
                        "const": "SUPOSIÇÕES"
                      }
                    },
                    "required": [
                      "id",
                      "label"
                    ]
                  },
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "id": {
                        "const": "tests"
                      },
                      "label": {
                        "const": "TESTES"
                      }
                    },
                    "required": [
                      "id",
                      "label"
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    }
  ]
}
```

### Validações complementares obrigatórias

Mesmo um JSON válido precisa passar por estas regras de aplicação:

1. Largura/altura respeitam a proporção indicada;na referência,largura×2=altura×3.
2. Principal+inspetor=100quando o inspetor estiver visível. Quando oculto,usar100%da região útil para o conteúdo;os percentuais são a configuração de estado aberto.
3. IDs de nós são únicos;raiz existe e tem`parent_id:null`.
4. Cada pai,aresta,seleção e referência de evidência resolve para um ID existente.
5. Arestas correspondem aos`parent_id`;sem segundo pai,ciclos,nós desconectados ou duplicação silenciosa nesta receita de árvore.
6. Bandas da OST preservam ordem;`kind`dos nós é compatível com a banda e com as relações declaradas.
7. Não existe teste“aprovado”inventado;estado deve corresponder ao conteúdo fornecido.
8. `synthetic`sempre produz selo visível,também em detalhes/evidências pertinentes.
9. Itens em`exact_ui_text`precisam aparecer com grafia e acentuação corretas.
10. Densidade e legibilidade são verificadas no render final,não inferidas do número de nós.

## 13. Exemplo de pedido preenchido

Este exemplo reconstrói a composição pretendida da OST de referência. É uma base autoral de geração,não uma extração automatizada dos pixels da imagem.

```json
{
  "schema_version": "1.0.0",
  "style_id": "atelie-wire-mono-single-screen",
  "artifact_stage": "wireframe_static",
  "language": "pt-BR",
  "subject": "OST preenchida para validar composição",
  "primary_user_task": "Entender as relações e inspecionar uma oportunidade sem sair da tela",
  "layout_recipe": "ost_five_bands",
  "frame": {
    "screen_count": 1,
    "target_width_px": 1536,
    "target_height_px": 1024,
    "target_aspect_ratio": "3:2",
    "device_frame": false,
    "show_all_primary_content": true
  },
  "style": {
    "fidelity": "low",
    "palette": "grayscale",
    "typography": "sans_serif",
    "shadows": false,
    "gradients": false,
    "decorative_illustrations": false,
    "selection_cue": "double_border",
    "connector_style": "orthogonal_no_arrows",
    "spacing_unit_px": 8
  },
  "layout": {
    "header": true,
    "title": "Retomar decisões de oficinas",
    "subtitle": "Árvore de oportunidades e soluções",
    "toolbar": [
      "zoom_out",
      "zoom_value",
      "zoom_in",
      "fit_to_screen",
      "collapse_branches"
    ],
    "main_region_percent": 78,
    "inspector": {
      "visible": true,
      "width_percent": 22,
      "title": "Oportunidade selecionada",
      "selected_node_id": "O2",
      "actions": [
        "view_evidence",
        "highlight_path",
        "close_inspector"
      ]
    },
    "footer_interaction_note": true
  },
  "content": {
    "nature": "synthetic",
    "example_badge": true,
    "provenance_note": "Exemplo inteiramente fictício; referências e textos não são evidências de pesquisa real.",
    "root_id": "R1",
    "bands": [
      {
        "id": "result",
        "label": "RESULTADO"
      },
      {
        "id": "opportunities",
        "label": "OPORTUNIDADES"
      },
      {
        "id": "solutions",
        "label": "SOLUÇÕES"
      },
      {
        "id": "assumptions",
        "label": "SUPOSIÇÕES"
      },
      {
        "id": "tests",
        "label": "TESTES"
      }
    ],
    "nodes": [
      {
        "id": "R1",
        "kind": "outcome",
        "label": "Retomar decisões sem perder o contexto",
        "parent_id": null,
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "O1",
        "kind": "opportunity",
        "label": "Encontrar o registro",
        "parent_id": "R1",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "O2",
        "kind": "opportunity",
        "label": "Entender como a decisão foi construída",
        "parent_id": "R1",
        "status": null,
        "evidence_refs": [
          "E-02",
          "E-05"
        ]
      },
      {
        "id": "O3",
        "kind": "opportunity",
        "label": "Escolher o que pode circular",
        "parent_id": "R1",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "S1",
        "kind": "solution",
        "label": "Busca por episódio",
        "parent_id": "O1",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "A1",
        "kind": "assumption",
        "label": "Lembram do episódio",
        "parent_id": "S1",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "T1",
        "kind": "test",
        "label": "Localizar uma decisão",
        "parent_id": "A1",
        "status": "A realizar",
        "evidence_refs": []
      },
      {
        "id": "S2",
        "kind": "solution",
        "label": "Índice por encontro",
        "parent_id": "O1",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "A2",
        "kind": "assumption",
        "label": "Reconhecem o encontro",
        "parent_id": "S2",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "T2",
        "kind": "test",
        "label": "Comparar dois índices",
        "parent_id": "A2",
        "status": "A realizar",
        "evidence_refs": []
      },
      {
        "id": "S3",
        "kind": "solution",
        "label": "Linha do tempo",
        "parent_id": "O2",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "A3",
        "kind": "assumption",
        "label": "A sequência esclarece",
        "parent_id": "S3",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "T3",
        "kind": "test",
        "label": "Reconstituir o percurso",
        "parent_id": "A3",
        "status": "A realizar",
        "evidence_refs": []
      },
      {
        "id": "S4",
        "kind": "solution",
        "label": "Resumo com fontes",
        "parent_id": "O2",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "A4",
        "kind": "assumption",
        "label": "As fontes dão contexto",
        "parent_id": "S4",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "T4",
        "kind": "test",
        "label": "Ler resumo e fontes",
        "parent_id": "A4",
        "status": "A realizar",
        "evidence_refs": []
      },
      {
        "id": "S5",
        "kind": "solution",
        "label": "Prévia de circulação",
        "parent_id": "O3",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "A5",
        "kind": "assumption",
        "label": "Percebem o que sai",
        "parent_id": "S5",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "T5",
        "kind": "test",
        "label": "Revisar uma prévia",
        "parent_id": "A5",
        "status": "A realizar",
        "evidence_refs": []
      },
      {
        "id": "S6",
        "kind": "solution",
        "label": "Versões por destinatário",
        "parent_id": "O3",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "A6",
        "kind": "assumption",
        "label": "Distinguem os públicos",
        "parent_id": "S6",
        "status": null,
        "evidence_refs": []
      },
      {
        "id": "T6",
        "kind": "test",
        "label": "Comparar duas versões",
        "parent_id": "A6",
        "status": "A realizar",
        "evidence_refs": []
      }
    ],
    "edges": [
      {
        "from": "R1",
        "to": "O1"
      },
      {
        "from": "R1",
        "to": "O2"
      },
      {
        "from": "R1",
        "to": "O3"
      },
      {
        "from": "O1",
        "to": "S1"
      },
      {
        "from": "S1",
        "to": "A1"
      },
      {
        "from": "A1",
        "to": "T1"
      },
      {
        "from": "O1",
        "to": "S2"
      },
      {
        "from": "S2",
        "to": "A2"
      },
      {
        "from": "A2",
        "to": "T2"
      },
      {
        "from": "O2",
        "to": "S3"
      },
      {
        "from": "S3",
        "to": "A3"
      },
      {
        "from": "A3",
        "to": "T3"
      },
      {
        "from": "O2",
        "to": "S4"
      },
      {
        "from": "S4",
        "to": "A4"
      },
      {
        "from": "A4",
        "to": "T4"
      },
      {
        "from": "O3",
        "to": "S5"
      },
      {
        "from": "S5",
        "to": "A5"
      },
      {
        "from": "A5",
        "to": "T5"
      },
      {
        "from": "O3",
        "to": "S6"
      },
      {
        "from": "S6",
        "to": "A6"
      },
      {
        "from": "A6",
        "to": "T6"
      }
    ],
    "evidence_items": [
      {
        "id": "E-02",
        "label": "Nota de oficina",
        "nature": "synthetic",
        "representation": "note"
      },
      {
        "id": "E-05",
        "label": "Entrevista",
        "nature": "synthetic",
        "representation": "unspecified"
      }
    ],
    "default_test_status": "A realizar"
  },
  "interactions": {
    "allowed": [
      "select_node",
      "collapse_branch",
      "zoom",
      "fit_to_screen",
      "view_evidence",
      "highlight_path",
      "close_inspector"
    ],
    "implementation": "annotated_only",
    "edit_nodes": false,
    "drag_nodes": false,
    "create_or_delete_nodes": false
  },
  "generation": {
    "output_format": "png",
    "exact_ui_text": [
      "Ateliê / OST",
      "EXEMPLO FICTÍCIO",
      "Retomar decisões de oficinas",
      "Árvore de oportunidades e soluções",
      "Ajustar à tela",
      "Recolher ramos",
      "Oportunidade selecionada",
      "Ver evidências",
      "Destacar caminho",
      "Interpretação ilustrativa — não é fala literal.",
      "Interações previstas: selecionar nó · recolher ramo · zoom · abrir evidências"
    ],
    "text_priority_over_density": true,
    "allow_silent_content_reduction": false,
    "allow_extra_screens": false,
    "notes": "Selecionar O2 por borda dupla. Modelo de composição, não uma árvore metodologicamente encerrada."
  }
}
```

## 14. Modelo curto para futuros pedidos

> Use o estilo `atelie-wire-mono-single-screen`,versão 1.0.0,conforme o Markdown anexo. Gere primeiro um wireframe estático de uma única tela,em português,monocromático e de baixa fidelidade. Preserve tipografia simples,caixas com borda fina,seleção por borda dupla,conectores ortogonais e apenas interações básicas anotadas. Não gere interface final,novas telas ou funcionalidades extras.
>
> Assunto:[preencher].
> Tarefa principal:[preencher].
> Receita de composição:[ost_five_bands / hierarchy_with_inspector / custom_single_screen].
> Conteúdo/nós/relações:[fornecer ou autorizar exemplo fictício].
> Nó selecionado:[ID ou nenhum].
> Inspetor:[visível/oculto;conteúdo].
> Textos exatos:[listar].
> Saída:[PNG para wire inicial;HTML somente quando solicitado].
> Se não couber com texto legível,não apagar conteúdo nem reduzir fonte silenciosamente:apresente a limitação e proponha um recorte.

## 15. Checklist de aceite

### Forma

- [ ] Há uma única tela principal,sem dispositivo ou colagem.
- [ ] O enquadramento entregue e sua proporção foram registrados.
- [ ] O conteúdo central não é cortado sem aviso.
- [ ] O painel não cobre o mapa.
- [ ] Existe hierarquia clara de cabeçalho,título,toolbar,conteúdo e detalhe.

### Estilo

- [ ] Só há preto,branco e cinzas.
- [ ] Não há sombras,gradientes,ilustrações ou acabamento de marketing.
- [ ] Texto é legível;cartões não viraram miniaturas.
- [ ] Seleção é distinguível de foco e não depende só de cor.
- [ ] Bordas,espaçamentos e conectores são consistentes.

### Estrutura e conteúdo

- [ ] Todos os vínculos fazem sentido e resolvem;sem cruzamentos confusos.
- [ ] Nenhuma relação ou evidência foi inventada como real para preencher simetria.
- [ ] Estados/IDs/textos/acentos foram conferidos no resultado.
- [ ] Exemplo fictício está identificado.
- [ ] Conteúdo detalhado fica no inspetor,não em todos os cartões.

### Comportamento e escopo

- [ ] Imagem estática chama suas ações de previstas.
- [ ] EmHTML,ações declaradas funcionam e têm acesso por teclado.
- [ ] Não foram adicionados edição,drag,IA,publicação ou navegação extra sem pedido.
- [ ] Schema válido não foi confundido com teste de render ou de usabilidade.

## 16. Versionamento e uso no projeto

Identificador de estilo:`atelie-wire-mono-single-screen`.
Versão inicial:`1.0.0`.
Receita da referência:`ost_five_bands`.

Alterações de assunto/texto/dados são instâncias,não necessariamente nova versão do estilo. Mudanças obrigatórias de linguagem visual,estrutura do contrato ou comportamento exigem versionar e registrar a diferença.

Para reaplicar em outro pedido,anexe esteMarkdown ou mantenha-o como instrução/arquivo de referência do projeto e cite o`style_id`. O arquivo torna a regra explícita;não pressupõe memória permanente em qualquer conversa ou ferramenta.

### Verificação deste documento

O exemplo foi validado contra oJSON Schema proposto. Foram conferidos22 IDs de nós únicos,21 arestas resolvidas,proporção 3:2 e divisão78/22. Isso não certifica a imagem anteriormente gerada nem uma interfaceHTMLque ainda não foi implementada.
