const adventures = document.querySelector('.adventures');
const hashtag = document.querySelector('.hashtag');
const logo = document.querySelector('.logo');

adventures.onclick = async function (event) {
  if (event.target.nodeName != 'A' || event.target.className != 'adventure__hashtag') return;

  event.preventDefault();
  const href = event.target.getAttribute('href');
  const tag = href.split('/').pop();

  const hashtag = await fetch(`/api/hashtag/${tag}`)
    .then((data) => data.json())
    .catch(() => alert('Не удалось загрузить приключения'));

  state = {
    type: 'hashtag',
    name: hashtag.name,
    tag: hashtag.tag,
    elements: hashtag.adventures,
  };
  changeHandler();

  history.pushState(state, '', href);
  document.title = 'Список квестов по хэштэгу';
};

logo.onclick = async function (event) {
  event.preventDefault();

  const adventures = await fetch(`/api/adventures/0`)
    .then((data) => data.json())
    .catch(() => alert('Не удалось загрузить приключения'));

  state = {
    page: 1,
    finished: false,
    type: 'adventures',
    elements: adventures,
  };
  changeHandler();

  history.pushState(state, '', '/');
  document.title = 'Список квестов';
};

window.onpopstate = function (event) {
  state = event.state;
  changeHandler();
};

function changeHandler() {
  hashtag.innerText = state.type === 'hashtag' ? `#${state.name}` : '';

  adventures.innerHTML = '';

  for (adventure of state.elements) {
    const adventureElement = createAdventureElement(adventure);
    document.querySelector('.adventures').appendChild(adventureElement);
  }

  if (state.type === 'adventures') {
    resetObserver();
  }
}
