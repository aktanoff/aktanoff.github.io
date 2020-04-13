const adventuresNode = document.querySelector('.adventures');
adventuresNode.addEventListener('click', async function (event) {
  const ANCHOR_NODE_NAME = 'A';
  const HASHTAG_CLASSNAME = 'adventure__hashtag';

  const targetClasses = [...event.target.classList];

  if (!(event.target.nodeName === ANCHOR_NODE_NAME && targetClasses.includes(HASHTAG_CLASSNAME))) {
    return;
  }

  event.preventDefault();
  const href = event.target.getAttribute('href');
  const tag = href.split('/').pop();

  try {
    const hashtag = await getHashtag(tag);

    imitateTransition(
      {
        page: null,
        finished: null,
        type: 'hashtag',
        name: hashtag.name,
        tag: hashtag.tag,
        elements: hashtag.adventures,
      },
      href,
      'Список квестов по хэштэгу'
    );
  } catch (err) {
    console.error(err);
  }
});

const logo = document.querySelector('.logo');
logo.addEventListener('click', async function (event) {
  event.preventDefault();
  try {
    const adventures = await getAdventures(0);

    imitateTransition(
      {
        page: 1,
        finished: false,
        type: 'adventures',
        name: null,
        tag: null,
        elements: adventures,
      },
      '/',
      'Список квестов'
    );
  } catch (err) {
    console.error(err);
  }
});

window.addEventListener('popstate', function (event) {
  state = event.state;
  renderPage();
});

function imitateTransition(newState, newURL, newTitle) {
  state = newState;
  renderPage();

  history.pushState(state, '', newURL);
  document.title = newTitle;
}

function renderPage() {
  const hashtag = document.querySelector('.hashtag');
  hashtag.innerText = state.type === 'hashtag' ? `#${state.name}` : '';

  while (adventuresNode.firstChild) {
    adventuresNode.removeChild(adventuresNode.firstChild);
  }

  for (adventure of state.elements) {
    const adventureElement = createAdventureElement(adventure);
    adventuresNode.appendChild(adventureElement);
  }

  if (state.type === 'adventures') {
    resetObserver();
  }
}
