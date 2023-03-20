export default function getContent(htmlDoc: HTMLDocument) {
  const mainArticleElement = htmlDoc.querySelectorAll('main article');
  if (mainArticleElement.length === 1) {
    return mainArticleElement[0];
  }

  const mainElement = htmlDoc.querySelector('main, [role="main"]');
  if (mainElement) {
    return mainElement;
  }

  const articleElement = htmlDoc.querySelector('article');
  if (articleElement) {
    return articleElement;
  }

  return htmlDoc.body;
}
