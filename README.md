# cw-chessboard

Веб-шахматная доска с возможностью расширения и улучшения за счет плагинов, построеная на фреймворке Vue 3.

Библиотека имеет с коробки 4 базовых компонента и 6 хуков для создания дополнительных плагинов(Улучшений) под конктретные задачи.

## Компоненты:

1. **Chessboard** - Главный компонент отвечающий за отображение доски и фигур, а так-же отслеживает все изменения на доске анимируя при возможности.

   | Атрибуты | Тип | описание | знач. по умолчанию |
   | --- | :-: | --: | --: |
   | fen | string | расположение фигур в формате Fen. | нач. раположение |
   | orientation | "w"-"b" | ориентация доски. | "w" |
   | borderSize | number | размер обводки доски (маштабируется). | 12 |
   | roundSize | number | скругление углов доски (маштабируется). | 0 |
   | fontSize | number | размер шрифта (маштабируется). | 24 |
   | coordOutside | boolean | раположение координат снаружи. |  |
   | coordMode | "none"-"left"-"right" | отображение координат(скрыты, слева, справа) | "left" |
   | duration | number | скорость анимации в мс | 300 |
   | alphaPiece | boolean | прозрачная фигура(в половину или скрыта) |  |
   | boardSet | string | стиль доски | "default" |
   | pieceSet | string | стиль фигур | "default" |
   | resize | false-"width"-"height"-true | изменение размера доски(нет, ширина, высота, оба) | true |

   boardSet: Доступны 5 вариантов стиля доски

   1. default.
   2. blue.
   3. green.
   4. sport.
   5. wood_light.

   Добавление своего стиля доски:

   ```scss
   @import "cw-chessboard/style/chessboard-theme.scss";

   @include chessboard-theme(
     название стиля,
     изображение доски закодированное в base64,
     цвет координат на белом квадратах,
     цвет координат на черных квадратах,
     цвет координат и обводки доски 1px в режиме координаты снаружи,
     цвет обводки доски,
     цвет маркеров по умолчанию,
     цвет красных маркеров,
     цвет зеленых маркеров,
     цвет синих маркеров
   );
   ```

   pieceSet: Доступны 5 вариантов стиля фигур

   1. default.
   2. grady.
   3. staunty.
   4. stock.

   Добавление своего стиля фигур:

   ```scss
   @import "cw-chessboard/style/piece-theme.scss";

   @include piece-theme(
     название стиля,
     изображение белая пешка закодированное в base64,
     изображение белая ладья закодированное в base64,
     изображение белый конь закодированное в base64,
     изображение белый слон закодированное в base64,
     изображение белый ферзь закодированное в base64,
     изображение белый король закодированное в base64,
     изображение черная пешка закодированное в base64,
     изображение черная ладья закодированное в base64,
     изображение черный конь закодированное в base64,
     изображение черный слон закодированное в base64,
     изображение черный ферзь закодированное в base64,
     изображение черный король закодированное в base64
   );
   ```

2. **ChessboardMarkers** - Вложеный компонент отвечающий за отображение маркеров на доске.

   | Атрибуты |   Тип    |    описание     | знач. по умолчанию |
   | -------- | :------: | :-------------: | -----------------: |
   | markers  | Marker[] | Массив маркеров |                 [] |

   Marker - может быть MarkerPoint | MarkerText | MarkerArrow

   MarkerPoint :

   | свойство | Тип | описание |
   | --- | :-: | :-: |
   | square | string | координаты |
   | color? | "red"-"green"-"blue" | цвет маркера (при необходимости) |
   | type | MARKER.FRAME-CIRCLE-DOT-SQUARE-NONE | тип маркера (рамка, круг, точка, квадрат, скрыть) |

   MarkerText :

   | свойство |         Тип          |                 описание                 |
   | -------- | :------------------: | :--------------------------------------: |
   | square   |        string        |                координаты                |
   | color?   | "red"-"green"-"blue" |     цвет маркера (при необходимости)     |
   | type     |     MARKER.TEXT      |               тип маркера                |
   | text     |        string        | отображаймый текст на квадрате по центру |

   MarkerArrow :

   | свойство |         Тип          |             описание             |
   | -------- | :------------------: | :------------------------------: |
   | square   |        string        |          координаты из           |
   | color?   | "red"-"green"-"blue" | цвет маркера (при необходимости) |
   | type     |     MARKER.ARROW     |           тип маркера            |
   | toSquare |        string        |           координаты в           |

3. ChessboardControl - Вложеный компонент отвечающий за взаимодействие с фигурами.

   | Атрибуты | Тип | описание | знач. по умолчанию |
   | --- | :-: | :-: | --: |
   | enableColor | "none"-"w"-"b"-"all" | Какие фигуры разрешено перемещать(запрещенно, белые, черные, любые) | "all" |
   | mode | "press"-"move"-"auto" | Стиль перемещения(клик, перетаскивание, любой) | "auto" |
   | alignPiece | boolean | выровнять фигуру по клеткам при перетаскивании |  |

   | События | Аргументы | описание |
   | --- | :-: | --: |
   | beforeMove | (square: string, done: function) | Вызывается перед перемещением фигуры с клеткой откуда начинается перемещение, вызвать done(true) чтобы разрешить премещение иначе done(false) |
   | afterMove | (from: string, to:string, done: function) | Вызывается после перемещениея фигуры с клеткой откуда начинается перемещение и на какой клетке закончилось, вызвать done(true) чтобы разрешить премещение иначе done(false) фигура вернется на исходный квадрат |
   | cancelMove | (square:string) | Вызывается с клеткой откуда началось перемещение в результате отмены перемещения |
   | enterSquare | (square:string) | Вызывается каждый раз с клеткой над которой находится фигура |
   | leaveSquare | (square:string) | Вызывается каждый раз с клеткой над которой находилась фигура ранее |

   **Никогда не забывайте вызвать done!!!**

4. **PromotionDialog** - Вложеный компонент отвечающий за диалоговое окно при повышении. имеет две функции:

   1. require() - для отображения окна выбора возвращает 'q' | 'r' | 'b' | 'n'.
   2. abort() - для отмены.

   ```vue
   <template>
     <Chessboard>
       <PromotionDialog ref="promotionDialog" />
     </Chessboard>
   </template>
   ```

   ```ts
   const promotionDialog = ref<InstanceType<typeof PromotionDialog>>();
   onMounted(async () => {
      try
      {
         const propmotion = await promotionDialog.value?.require();
      }
      catch()
      {
         console.log("aborted!");
      }
   });
   ```
