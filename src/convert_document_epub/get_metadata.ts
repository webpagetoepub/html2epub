import { Step } from '../step';

const DESCRIPTION = 'Retrieving metadata from HTML document';


function getMetadata(htmlDoc: HTMLDocument, url: string) {
  return {
    title: getTitle(htmlDoc, url),
    date: getDate(htmlDoc),
    author: getAuthor(htmlDoc),
    publisher: getPublisher(htmlDoc) || url,
    uuid: url,
    description: getDescription(htmlDoc),
    tags: getTags(htmlDoc),
  }
}

function getTitle(htmlDoc: HTMLDocument, url: string) {
  if (htmlDoc.title) {
    return htmlDoc.title;
  }

  try {
    const urlObject = new URL(url);

    return urlObject.hostname;
  } catch (e) {
    return url;
  }
}

function getDate(htmlDoc: HTMLDocument) {
  const datePublishedStructuredMetadata = htmlDoc.querySelector(
    'meta[itemprop="datePublished"][content]'
  );
  if (datePublishedStructuredMetadata) {
    try {
      return new Date(datePublishedStructuredMetadata.getAttribute('content'));
    } catch (e) { }
  }

  const startDate = htmlDoc.querySelector(
    'time[itemprop="startDate"][datetime]'
  );
  if (startDate) {
    try {
      return new Date(startDate.getAttribute('datetime'));
    } catch (e) { }
  }

  const contentDate = getContentFromMetatags(
    htmlDoc,
    [
      'article:published_time', 'article:modified_time', 'book:release_date',
      'og:article:published_time', 'og:article:modified_time',
      'og:book:release_date',
    ],
  );
  if (contentDate) {
    try {
      return new Date(contentDate);
    } catch (e) { }
  }

  return new Date();
}

function getAuthor(htmlDoc: HTMLDocument) {
  const contentAuthor = getContentFromMetatags(htmlDoc, ['author']);
  if (contentAuthor) {
    return contentAuthor;
  }

  const authorStructuredMetadata = htmlDoc.querySelector(
    '[itemprop="author"] meta[itemprop="name"][content]'
  );
  if (authorStructuredMetadata) {
    return authorStructuredMetadata.getAttribute('content');
  }

  const authorStructured = htmlDoc.querySelector('[itemprop="author"]');
  if (authorStructured) {
    return authorStructured.textContent;
  }

  return '';
}

function getPublisher(htmlDoc: HTMLDocument) {
  const publisherStructuredMetadata = htmlDoc.querySelector(
    '[itemprop="publisher"] meta[itemprop="name"][content]'
  );
  if (publisherStructuredMetadata) {
    return publisherStructuredMetadata.getAttribute('content');
  }

  return getContentFromMetatags(
    htmlDoc,
    ['publisher', 'owner', 'copyright', 'og:site_name'],
  );
}

function getDescription(htmlDoc: HTMLDocument) {
  return getContentFromMetatags(
    htmlDoc,
    ['description', 'og:description', 'subtitle', 'abstract'],
  ) || '';
}

function getTags(htmlDoc: HTMLDocument) {
  const content = getContentFromMetatags(
    htmlDoc,
    ['news_keywords', 'keywords'],
  );

  if (content) {
    return content.split(/\s*,\s*/);
  }

  return [];
}

function getContentFromMetatags(
  htmlDoc: HTMLDocument,
  names: string[],
): string | null {
  for (const name of names) {
    const metaElement = htmlDoc.querySelector(`meta[name="${name}"][content]`);

    if (metaElement) {
      const content = metaElement.getAttribute('content').trim();

      if (content) {
        return content;
      }
    }
  }

  return null;
}

export default new Step(DESCRIPTION, getMetadata);
