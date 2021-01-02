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

function addAnimationRotateCard(card, option) {
  let optionRotate = option
    ? [{ transform: "rotateY(180deg)" }, { transform: "rotateY(0deg)" }]
    : [{ transform: "rotateY(0deg)" }, { transform: "rotateY(180deg)" }];

  let rotateCardKeyFrame = new KeyframeEffect(card, optionRotate, {
    duration: 1000,
    fill: "forwards",
  });
  let rotateCardAnimation = new Animation(
    rotateCardKeyFrame,
    document.timeline
  );
  rotateCardAnimation.play();
}

function addAnimationDisappearImageCard(image, option) {
  let optionDisappear = option
    ? [{ opacity: 0 }, { opacity: 1 }]
    : [{ opacity: 1 }, { opacity: 0 }];

  let disappearImageCardKeyFrame = new KeyframeEffect(image, optionDisappear, {
    delay: option ? 500 : 0,
    duration: 500,
    fill: "forwards",
  });
  let disappearImageCardAnimation = new Animation(
    disappearImageCardKeyFrame,
    document.timeline
  );
  disappearImageCardAnimation.play();
}
function getCardsInFaceButNotPair() {
  let allCardsNotPaired = document.querySelectorAll(
    '[id^="card"][class*="is-front"]:not([class*="paired"])'
  );
  return allCardsNotPaired;
}
function thereAreTwoCardInFaceButNotPair() {
  let allCardsNotPaired = document.querySelectorAll(
    '[id^="card"][class*="is-front"]:not([class*="paired"])'
  );
  return allCardsNotPaired.length == 2 ? true : false;
}
function clickCard(event) {
  let card =
    event.target.tagName == "DIV" ? event.target : event.target.offsetParent;

  if (!card.classList.contains("is-front")) {
    // card.classList.remove('bg-info')
    card.classList.add("is-front");
    // card.classList.add('bg-warning')
    addAnimationRotateCard(card, true);
    addAnimationDisappearImageCard(card.getElementsByTagName("img")[0], true);

    if (thereAreTwoCardInFaceButNotPair()) {
      let cardsNotPair = getCardsInFaceButNotPair();
      let cardOne = cardsNotPair[0];
      let cardTwo = cardsNotPair[1];
      let imgOne = cardOne.getElementsByTagName("img")[0];
      let imgTwo = cardTwo.getElementsByTagName("img")[0];

      if (imgOne.getAttribute("src") == imgTwo.getAttribute("src")) {
        cardOne.classList.add("paired");
        cardTwo.classList.add("paired");

        cardOne.removeEventListener("click", clickCard);
        cardTwo.removeEventListener("click", clickCard);
      } else {
        setTimeout(() => {
          cardOne.dispatchEvent(new Event("click"));
          cardTwo.dispatchEvent(new Event("click"));
        }, 2000);
      }
    }
  } else {
    card.classList.remove("is-front");
    addAnimationRotateCard(card, false);
    addAnimationDisappearImageCard(card.getElementsByTagName("img")[0], false);
  }
}
function clickCardWithoutLogic(card) {
  if (!card.classList.contains("is-front")) {
    // card.classList.remove('bg-info')
    card.classList.add("is-front");
    // card.classList.add('bg-warning')
    addAnimationRotateCard(card, true);
    addAnimationDisappearImageCard(card.getElementsByTagName("img")[0], true);
  } else {
    card.classList.remove("is-front");
    addAnimationRotateCard(card, false);
    addAnimationDisappearImageCard(card.getElementsByTagName("img")[0], false);
  }
}
const eventCard = () => {
  document.querySelectorAll('[id^="card"]').forEach((card) => {
    // console.log(card)
    card.addEventListener("click", clickCard);
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

  setTimeout(() => {
    let allCards = document.querySelectorAll('[id^="card"]');
    allCards.forEach((card) => {
      clickCardWithoutLogic(card);
    });
  }, 1500);
  setTimeout(() => {
    let allCards = document.querySelectorAll('[id^="card"]');
    allCards.forEach((card) => {
      clickCardWithoutLogic(card);
    });
    eventCard();
  }, 3000);
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
