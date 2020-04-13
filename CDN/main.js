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
  const adventureNodes = document.querySelectorAll('.adventure');

  adventureNodes.forEach((element) => observer.unobserve(element));

  if (adventureNodes.length) {
    observer.observe(adventureNodes[adventureNodes.length - 1]);
  }
}

function createAdventureElement({ scenes, picture, name, description, hashtags }) {
  const adventure = document.createElement('article');
  adventure.classList.add('adventure');

  const adventurePicture = document.createElement('section');
  adventurePicture.classList.add('adventure__picture');

  const adventurePictureLink = document.createElement('a');
  adventurePictureLink.setAttribute('href', `/scene/${scenes[0].id}`);

  const pictureImg = document.createElement('img');

  if (picture) {
    pictureImg.setAttribute('src', picture);
    pictureImg.setAttribute('alt', `Изображение квеста «${name}»`);
  } else {
    pictureImg.setAttribute('src', 'https://aktanoff.github.io/CDN/adventure1.png');
    pictureImg.setAttribute('alt', `Стандартное изображение`);
  }

  adventurePictureLink.appendChild(pictureImg);
  adventurePicture.appendChild(adventurePictureLink);
  adventure.appendChild(adventurePicture);

  const adventureMain = document.createElement('section');
  adventureMain.classList.add('adventure__main');

  const adventureName = document.createElement('section');
  adventureName.classList.add('adventure__name');

  const adventureNameLink = document.createElement('a');
  adventureNameLink.setAttribute('href', `/scene/${scenes[0].id}`);
  adventureNameLink.innerText = name;

  adventureName.appendChild(adventureNameLink);
  adventureMain.appendChild(adventureName);

  if (description) {
    const adventureDescription = document.createElement('section');
    adventureDescription.classList.add('adventure__description');

    adventureDescription.innerText = description;
    adventureMain.appendChild(adventureDescription);
  }

  if (hashtags.length) {
    const adventureHashtags = document.createElement('section');
    adventureHashtags.classList.add('adventure__hashtags');

    for (const { tag, name } of hashtags) {
      const adventureHashtag = document.createElement('a');
      adventureHashtag.classList.add('adventure__hashtag');
      adventureHashtag.innerText = `#${name}`;
      adventureHashtag.setAttribute('href', `/hashtag/${tag}`);

      adventureHashtags.appendChild(adventureHashtag);
    }

    adventureMain.appendChild(adventureHashtags);
  }

  adventure.appendChild(adventureMain);

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

    for (const adventure of adventures) {
      const adventureElement = createAdventureElement(adventure);
      document.querySelector('.adventures').appendChild(adventureElement);
    }

    resetObserver();
  } catch (error) {
    console.error(error);
  }
}

resetObserver();
