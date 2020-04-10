const observer = new IntersectionObserver((entries) => {
  if (!entries.length || state.type !== 'adventures' || state.finished) {
    return;
  }

  const lastEntry = entries[entries.length - 1];

  if (lastEntry.isIntersecting) {
    loadAndPutAdventures();
  }
});

function resetObserver() {
  document.querySelectorAll('.adventure').forEach((element) => observer.unobserve(element));
  const lastAdventure = document.querySelector('.adventure:last-child');

  if (lastAdventure) {
    observer.observe(lastAdventure);
  }
}

function createAdventureElement({ scenes, picture, name, description, hashtags }) {
  const adventure = document.createElement('article');
  adventure.className = 'adventure';

  const adventure_picture = document.createElement('section');
  adventure_picture.className = 'adventure__picture';

  const adventure_picture_link = document.createElement('a');
  adventure_picture_link.setAttribute('href', `/scene/${scenes[0].id}`);

  const pictureImg = document.createElement('img');

  if (picture) {
    pictureImg.setAttribute('src', picture);
    pictureImg.setAttribute('alt', `Изображение квеста «${name}»`);
  } else {
    pictureImg.setAttribute('src', 'https://aktanoff.github.io/CDN/adventure1.png');
    pictureImg.setAttribute('alt', `Стандартное изображение`);
  }

  adventure_picture_link.appendChild(pictureImg);
  adventure_picture.appendChild(adventure_picture_link);
  adventure.appendChild(adventure_picture);

  const adventure_main = document.createElement('section');
  adventure_main.className = 'adventure__main';

  const adventure_name = document.createElement('section');
  adventure_name.className = 'adventure__name';

  const adventure_name_link = document.createElement('a');
  adventure_name_link.setAttribute('href', `/scene/${scenes[0].id}`);
  adventure_name_link.innerText = name;

  adventure_name.appendChild(adventure_name_link);
  adventure_main.appendChild(adventure_name);

  if (description) {
    const adventure_description = document.createElement('section');
    adventure_description.className = 'adventure__description';
    adventure_description.innerText = description;
    adventure_main.appendChild(adventure_description);
  }

  if (hashtags.length) {
    const adventure_hashtags = document.createElement('section');
    adventure_hashtags.className = 'adventure__hashtags';

    for (const { tag, name } of hashtags) {
      const adventure_hashtag = document.createElement('a');
      adventure_hashtag.className = 'adventure__hashtag';
      adventure_hashtag.innerText = `#${name}`;
      adventure_hashtag.setAttribute('href', `/hashtag/${tag}`);

      adventure_hashtags.appendChild(adventure_hashtag);
    }

    adventure_main.appendChild(adventure_hashtags);
  }

  adventure.appendChild(adventure_main);

  return adventure;
}

async function loadAndPutAdventures() {
  try {
    const adventures = await getAdventures(state.page);

    state.page++;
    state.elements.push(...adventures);

    if (adventures.length === 0) {
      state.finished = true;
    }
    history.replaceState(state, '', '/');

    for (adventure of adventures) {
      const adventureElement = createAdventureElement(adventure);
      document.querySelector('.adventures').appendChild(adventureElement);
    }

    resetObserver();
  } catch (error) {
    alert(error);
  }
}

resetObserver();
