const articles = document.querySelectorAll('article.article')

for (const article of articles) {
  article.addEventListener('click', () => {
    location.href = `http://localhost:3000/article/${article.id.replace(
      'article-',
      ''
    )}`
  })
}
