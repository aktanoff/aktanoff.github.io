async function getAdventures(page) {
  return await fetch('/api/adventures/' + page)
    .then((data) => data.json())
    .catch(() => {
      throw new Error('Не удалось загрузить приключения');
    });
}

async function getHashtag(tag) {
  return await fetch(`/api/hashtag/${tag}`)
    .then((data) => data.json())
    .catch(() => {
      throw new Error('Не удалось загрузить приключения');
    });
}
