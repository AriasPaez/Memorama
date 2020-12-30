const getMatriz = () => {
  let matriz = new Array(3);
  for (i = 0; i < 3; i++) {
    matriz[i] = new Array(4);
  }
  return {
    matriz: matriz,
    len_matriz_rows: matriz.length,
    len_matriz_columns: matriz[0].length,
  };
};
const getContentCard = async (index) => {
  let content_card = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);
  let to_json = await content_card.json();
  return to_json.sprites.front_default;
};
const random_table = async () => {
  let { matriz, len_matriz_rows, len_matriz_columns } = getMatriz();
  let len_matriz = (len_matriz_columns * len_matriz_rows) / 2;
  for (var i = 0; i < len_matriz; i++) {
    let pokemon = await getContentCard(i + 1);
    let there_is_par = 0;
    while (there_is_par < 2) {
      let random_one = Math.floor(Math.random() * len_matriz_rows);
      let random_two = Math.floor(Math.random() * len_matriz_columns);
      if (matriz[random_one][random_two] == null) {
        matriz[random_one][random_two] = pokemon;
        there_is_par++;
      }
    }
  }
  return {
    matriz: matriz,
    len_matriz_rows: len_matriz_rows,
    len_matriz_columns: len_matriz_columns,
  };
};

function addAnimationRotateCard(card){

  let rotateCardKeyFrame = new KeyframeEffect(
    card,
    [
      {transform:'rotateY(0deg)'},
      {transform:'rotateY(180deg)'}
    ],
    {duration:3000,fill:'forwards'}
  )
  let rotateCardAnimation=new Animation(rotateCardKeyFrame, document.timeline)

}
function clickCard(card) {

  if(!card.classList.contains('is-front')){
    // card.classList.remove('bg-info')
    card.classList.add('is-front')
    // card.classList.add('bg-warning')
    card.getElementsByTagName("img")[0].style.opacity=1

    let rotateCardKeyFrame = new KeyframeEffect(
      card,
      [
        {transform:'rotateY(0deg)'},
        {transform:'rotateY(180deg)'}
      ],
      {duration:3000,fill:'both'}
    )
    let rotateCardAnimation=new Animation(rotateCardKeyFrame, document.timeline)
    rotateCardAnimation.play()
  }else{
    console.log('click but I already was clicked')
    card.classList.remove('is-front')
    let rotateCardKeyFrame = new KeyframeEffect(
      card,
      [
        {transform:'rotateY(180deg)'},
        {transform:'rotateY(0deg)'}
      ],
      {duration:3000,fill:'both'}
    )
    let rotateCardAnimation=new Animation(rotateCardKeyFrame, document.timeline)
    rotateCardAnimation.play()
  }


}
const eventCard = () => {
  document.querySelectorAll('[id^="card"]').forEach((card) => {
    addAnimationRotateCard(card)
    card.addEventListener("click", ()=>{
      clickCard(card)
    });
  });
};
const fill_game = async () => {
  let { matriz, len_matriz_rows, len_matriz_columns } = await random_table();
  let memorama = document.getElementById("memorama");
  let template_row = document.getElementById("template-row").content;
  let fragment = document.createDocumentFragment();

  for (var i = 0; i < len_matriz_rows; i++) {
    for (var j = 0; j < len_matriz_columns; j++) {
      let div = template_row.getElementById(`card ${j}`);
      let img = div.getElementsByTagName("img")[0];
      img.setAttribute("src", matriz[i][j]);
    }
    let clone = template_row.cloneNode(true);
    fragment.appendChild(clone);
  }
  memorama.replaceChildren(fragment);
  eventCard();
};
// const fill_game = async () => {
//   let { matriz, len_matriz_rows, len_matriz_columns } = await random_table();
//   let memorama = document.getElementById("memorama");
//   let template_row = document.getElementById("template-row").content;
//   let fragment = document.createDocumentFragment();
//   for (var i = 0; i < len_matriz_rows; i++) {
//     for (var j = 0; j < len_matriz_columns; j++) {
//       let div = template_row.getElementById(`card ${j}`);
//       let img = div.getElementsByTagName("img")[0];
//       img.setAttribute("src", matriz[i][j]);
//     }
//     let clone = template_row.cloneNode(true);
//     fragment.appendChild(clone);
//   }
//   memorama.replaceChildren(fragment);
//   eventCard();
// };

document.getElementById("restart-game").addEventListener("click", fill_game);
