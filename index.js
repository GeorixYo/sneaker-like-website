import { inventoryArr } from './inventory.js';

//* sizes - 4-15.5
let wishlist = ['Y2192923', 'Y219308'];

//! amount items per page
let perPage = 12;
//* checks if any item is in stock, if true returns lowest price
function isItemInStock(item) {
  let iter = inventoryArr[item].inStock;
  let lowest = Infinity;
  for (let cost in iter) {
    if (iter[cost] && iter[cost] < lowest) lowest = iter[cost];
  }
  if (lowest == Infinity) return false;
  else return lowest;
}
//* returns lowest price size of item that is in stock
function lowestCostSize(item) {
  let lowestPrice = isItemInStock(item);
  if (lowestPrice != false) {
    for (let i in inventoryArr[item].inStock) {
      if (inventoryArr[item].inStock[i] == lowestPrice) return i;
    }
  } else return false;
}
//* pushes positions of items right way (first is in stock, than out of stock)
function rightOrderCards(isInStock = true) {
  let arrF = [];
  let arrT = [];
  for (let item in inventoryArr) {
    isItemInStock(item) ? arrT.push(parseInt(item)) : arrF.push(parseInt(item));
  }
  let arr = [...arrT, ...arrF];
  return arr;
}
const rightOrderArray = [...rightOrderCards()];

function isThereDoubleIDs() {
  for (let itm1 in inventoryArr) {
    for (let itm2 in inventoryArr) {
      if (inventoryArr[itm1].id == inventoryArr[itm2].id && itm1 != itm2)
        return 'there is double ' + itm1 + ' ' + itm2;
    }
  }
  return 'No same IDs in inventoryArr';
}
console.log(isThereDoubleIDs());

//* returns amount pages
function amountPages(page = perPage) {
  let amountPages;
  if (inventoryArr.length <= page) amountPages = 1;
  else if (inventoryArr.length % page == 0)
    amountPages = inventoryArr.length / page;
  else
    amountPages =
      (inventoryArr.length - (inventoryArr.length % page)) / page + 1;
  return amountPages;
}
const totalPages = amountPages();
let currentPage = 1;

const choosedSize = new Object();
for (let itm in inventoryArr) choosedSize[itm] = lowestCostSize(itm);

//* returns cards in objects
function cards(indexStart = currentPage, amount = perPage) {
  const cards = [];
  let lastPage;
  if (indexStart * amount <= rightOrderArray.length)
    lastPage = indexStart * amount;
  else lastPage = rightOrderArray.length;

  for (let itm = indexStart * amount - amount; itm < lastPage; itm++) {
    const rightOrdElem = rightOrderArray[itm];
    const inventory = inventoryArr[rightOrdElem];
    const carding = new Object();

    //* checks if there is an Image for card
    function ifImg() {
      if (inventory.image)
        return `<img class="imga" draggable="false" src="${inventory.image}" alt="${inventory.name}">`;
      else return `<p class="card_name">Sorry, no image...</p>`;
    }
    //* returns correct Name of item position that fits in card
    function thatName() {
      if (inventory.name.length > 27)
        return inventory.name.slice(0, 27) + '...';
      else return inventory.name;
    }
    //* checks if item in user's wishlist
    function isWishlist() {
      if (wishlist.includes(inventory.id)) return '🖤';
      else return '🤍';
    }
    //* returns button and lowest cost of all sizes in stock (if no in stock => "not in stock and disabled button")

    function isButton() {
      if (!isItemInStock(rightOrdElem))
        return `<p class="cost_dis">Not in stock</p><button class="cardbutton_dis" type="button">Add to card</button>`;
      else
        return `<p class="lowest_cost_size">for size ${lowestCostSize(
          rightOrdElem
        )}</p><p class="cost">$${isItemInStock(
          rightOrdElem
        )}</p><button class="cardbutton" type="button">Add to card</button>`;
    }
    //* returns sizes that are in stock, if no - returns ""
    function stockSizes() {
      if (!isItemInStock(rightOrdElem)) return '';
      let stockPositions = `<div class="item description" onmouseleave="dynamicCost(event, false)"><div class="stock"><p class="sign_stock">Sizes in stock:</p>`;
      for (let stock in inventory.inStock) {
        let choosedSizeElem = '';
        if (choosedSize[rightOrdElem] == stock)
          choosedSizeElem = ' choosed_size_elem';
        if (inventory.inStock[stock]) {
          stockPositions += `<div class="is_stock${choosedSizeElem}" id="${stock}itm${rightOrdElem}" onmouseenter="dynamicCost(event)"><p>${stock}</p></div>`;
        }
      }
      stockPositions += `</div></div>`;
      return stockPositions;
    }
    //* returns HTML code of each card
    let card = `
        <div class="inv_card${
          isItemInStock(rightOrdElem) ? '' : ' no_in_stock'
        }" onclick="cardClickEvents(event)" id="${inventory.id}">
            <div class="heart"><p>${isWishlist()}</p></div>
            <div class="item img">${ifImg()}</div>
            <div class="item names"><p class="name">${thatName()}</p></div>
            <div class="item bottom_sec">
                ${isButton()}
            </div>
            ${stockSizes()}
        </div>`;
    //* adds items to cardsArr, if out of stock - to end, else to start
    carding.inStock = isItemInStock(rightOrdElem);
    carding.name = inventory.name;
    carding.card = card;
    cards.push(carding);
  }
  //* gives index to each object of cards
  for (let i in cards) {
    cards[i].index = i;
  }
  return cards;
}
//* returns single innerHTML element
function cardItems() {
  let currentCardings = [...cards()];
  let innerCard = ``;
  for (let card in currentCardings) {
    innerCard += currentCardings[card].card;
  }
  return innerCard;
}
//* returns pages navigation elements
function cardPages() {
  let pagesQube;
  let pageFunc = 'onclick="changeCardPage(event)"';
  if (totalPages == 1 || currentPage == 1)
    pagesQube = `<div class="pages back_page_dis"><p><</p></div>`;
  else pagesQube = `<div class="pages  back_page" ${pageFunc}><p><</p></div>`;

  for (let i = 1; i <= totalPages; i++) {
    if (currentPage == i)
      pagesQube += `<div class="pages current_page" id="current${i}"><p>${i}</p></div>`;
    else
      pagesQube += `<div class="pages other_page" ${pageFunc} id="current${i}"><p>${i}</p></div>`;
  }

  if (totalPages == 1 || currentPage == totalPages)
    pagesQube += `<div class="pages forward_page_dis"><p>></p></div>`;
  else
    pagesQube += `<div class="pages forward_page" ${pageFunc}><p>></p></div>`;
  return pagesQube;
}

//* First load of DOM elements
document.querySelector('.preview_page').style.cssText = 'display:none;';
document.querySelector('.main').innerHTML = cardItems();
document.querySelector('.pages_container').innerHTML = cardPages();

const markCard = document.querySelectorAll('.inv_card');
const cardImage = document.querySelectorAll('.imga');

//* change page
function changeCardPage(event) {
  if (event.target.closest('.other_page'))
    currentPage = parseInt(
      `${event.target.closest('.other_page').id}`.slice(7)
    );
  else if (event.target.closest('.forward_page')) currentPage += 1;
  else if (event.target.closest('.back_page')) currentPage -= 1;

  document.querySelector('.main').innerHTML = cardItems();
  document.querySelector('.pages_container').innerHTML = cardPages();
  return;
}

//* changes cost on card by hovering on available sizes (size - cost) || and returns default cost when mouse leaves
function dynamicCost(event, mouse = true) {
  const selector = document
      .getElementById(event.target.closest('.inv_card').id)
      .querySelector('.bottom_sec>.lowest_cost_size'),
    selector2 = document
      .getElementById(event.target.closest('.inv_card').id)
      .querySelector('.bottom_sec>.cost');
  const numb = mouse
    ? event.target.id
    : event.target.querySelector('.is_stock').id;
  if (mouse) {
    selector.textContent = 'for size ' + parseFloat(numb);
    selector2.textContent =
      '$' +
      inventoryArr[parseInt(`${numb}`.slice(`${parseFloat(numb)}`.length + 3))]
        .inStock[parseFloat(numb)];
  } else {
    selector.textContent =
      'for size ' +
      choosedSize[parseInt(`${numb}`.slice(`${parseFloat(numb)}`.length + 3))];
    selector2.textContent =
      '$' +
      inventoryArr[parseInt(`${numb}`.slice(`${parseFloat(numb)}`.length + 3))]
        .inStock[
        choosedSize[parseInt(`${numb}`.slice(`${parseFloat(numb)}`.length + 3))]
      ];
  }
}
//* adds or removes id's of items to wishlist
function like(event, Curpage = 'card') {
  if (Curpage == 'card') {
    let closest = event.target.closest('.inv_card').id;
    let targetElem;
    if (
      event.target ==
      document.getElementById(`${closest}`).querySelector(`.heart>p`)
    )
      targetElem = event.target;
    else targetElem = event.target.querySelector('p');
    if (wishlist.includes(closest)) {
      wishlist.splice(wishlist.indexOf(closest), 1);
      return (targetElem.innerHTML = '🤍');
    } else {
      wishlist.push(closest);
      return (targetElem.innerHTML = '🖤');
    }
  } else if (Curpage == 'preview') {
    let closest = `${event.target.closest('.whole_preview').id}`.slice(8, 15);
    console.log(closest);
    let targetElem;
    if (event.target == document.querySelector(`.preview_heart>p`))
      targetElem = event.target;
    else targetElem = event.target.querySelector('p');
    if (wishlist.includes(closest)) {
      wishlist.splice(wishlist.indexOf(closest), 1);
      return (targetElem.innerHTML = '🤍');
    } else {
      wishlist.push(closest);
      return (targetElem.innerHTML = '🖤');
    }
  }
}
function exitPreview(event) {}

function cardPreviewPage(event) {
  console.log(event.target + 'cardPreviewPage');
}
function cardSizePreviewPage(event) {
  console.log(event.target + 'cardSizePreviewPage');
}

function previewPage(event) {
  console.log(event.target.closest('.inv_card').id);

  function returnThatArray(event) {
    for (let i in inventoryArr) {
      if (inventoryArr[i].id == event.target.closest('.inv_card').id) return i;
    }
  }
  function returnThatSize(event) {
    let arr = returnThatArray(event);
    let thatCost = isItemInStock(arr);
    for (let i in inventoryArr[returnThatArray(event)].inStock) {
      if (inventoryArr[returnThatArray(event)].inStock[i] == thatCost) return i;
    }
    return false;
  }
  let thatArray = returnThatArray(event);
  function galeryImage(event) {
    let thatArr = inventoryArr[returnThatArray(event)];
    if (thatArr.galery[0]) return thatArr.galery[0];
    else return thatArr.image;
  }
  function availableSizes(event) {
    let thatArr = returnThatArray(event);
    let thatArrInStock = inventoryArr[returnThatArray(event)].inStock;
    if (!isItemInStock(thatArr))
      return '<p class="preview_sizes_not">No available sizes</p>';
    let stockPositions = ``;
    for (let stock in thatArrInStock) {
      if (thatArrInStock[stock]) {
        stockPositions += `<div class="${
          choosedSize[thatArr] == stock
            ? 'preview_that_size_active'
            : 'preview_that_size'
        }" id="${stock}preview${thatArr}"><p class="preview_size_size">${stock}</p><p class="preview_size_cost">$${
          thatArrInStock[stock]
        }</p></div>`;
      }
    }
    return stockPositions;
  }
  function isDescription(event) {
    let description = ``;
    let inv = inventoryArr[returnThatArray(event)].description;
    for (let i in inv) {
      const a = i.slice(0, 1).toUpperCase() + i.slice(1);
      if (inv[i])
        description += `<p class="inner_description_${i}">${a}: ${inv[i]}</p>`;
    }
    return description;
  }
  document.querySelector('section').style.cssText = 'display:block;';
  document.querySelector('.preview_page').innerHTML = `
    <div class="exit_preview_screen"></div>
    <div class="whole_preview" id="preview_${
      event.target.closest('.inv_card').id
    }_${returnThatArray(event)}">  
        <div class="preview_page">
            <div class="exit_preview_cross"><p>⨉</p></div>
            <div class="preview_heart"><p>🤍</p></div>
            <div class="preview_imagegalery">
                <div class="inner_back_image"><p><</p></div>
                <div class="inner_next_image"><p>></p></div>
                <div class="preview_imagegalery">
                    <img class="inner_galery_image" id="previewimg_0" src="${galeryImage(
                      event
                    )}" alt="">
                </div>
            </div>
            <div class="preview_name_sizes">
                <div class="inner_preview_name">
                    <p class="preview_inner_name">${
                      inventoryArr[returnThatArray(event)].name
                    }</p>
                    <p class="preview_inner_id">id: ${
                      inventoryArr[returnThatArray(event)].id
                    }</p>
                </div>
                <div class="inner_preview_sizes">
                    <p class="preview_inner_sizes">Available Sizes:</p>
                    <div class="inner_model_sizes">${availableSizes(
                      event
                    )}</div>
                </div>
            </div>
            <div class="preview_description">
                    <p class="inner_description_text">Description</p>
                    ${isDescription(event)}
            </div>
            <div class="preview_cost_and_buy">
                <p class="preview_inner_cost">${
                  choosedSize[thatArray]
                    ? '$' +
                      inventoryArr[thatArray].inStock[choosedSize[thatArray]]
                    : 'No sizes'
                }</p>
                ${
                  isItemInStock(thatArray)
                    ? '<p class="preview_inner_cost_sizesign">for ' +
                      choosedSize[thatArray] +
                      ' size</p>'
                    : ''
                }
                <button class="preview_inner_buy">Add to card</button>
            </div>
        </div>
    </div>`;
}
function changeImage(event, direction) {}
//? on consideration
function galeryBigImage(event) {}

function changeSizePrice(event) {
  document.querySelector('.preview_that_size_active').className =
    'preview_that_size';
  const arr = parseInt(
    event.target.id.slice(`${parseFloat(event.target.id)}`.length + 7)
  );
  const sizeArr = event.target.id.slice(
    0,
    `${parseFloat(event.target.id)}`.length
  );
  event.target.className = 'preview_that_size_active';
  document.querySelector(
    '.preview_inner_cost'
  ).textContent = `$${inventoryArr[arr].inStock[sizeArr]}`;
  document.querySelector(
    '.preview_inner_cost_sizesign'
  ).textContent = `for ${sizeArr} size`;
  choosedSize[arr] = sizeArr;
}
function addToTheBasket(event) {}

function cardClickEvents(event) {
  let maincard = event.target.closest('.inv_card').id;

  if (event.target.className == 'cardbutton') cardPreviewPage(event);
  else if (event.target.closest('is_stock')) cardSizePreviewPage(event);
  else if (
    event.target.className == 'heart' ||
    event.target ==
      document.getElementById(`${maincard}`).querySelector(`.heart>p`)
  )
    like(event);
  else previewPage(event);
}
function previewClickEvents(event) {
  if (
    event.target.className == 'exit_preview_screen' ||
    event.target.className == 'exit_preview_cross' ||
    event.target == document.querySelector('.exit_preview_cross>p')
  ) {
    document.querySelector('.preview_page').innerHTML = ``;
    document.querySelector('section').style.cssText = 'display:none;';
  } else if (
    event.target.className == 'preview_heart' ||
    event.target == document.querySelector('.preview_heart>p')
  )
    like(event, 'preview');
  else if (event.target.className == 'preview_that_size')
    changeSizePrice(event);
}

window.dynamicCost = dynamicCost;
window.changeCardPage = changeCardPage;
window.cardClickEvents = cardClickEvents;
window.previewClickEvents = previewClickEvents;
