export default class FileNotAllowedError extends Error {
  constructor(url: string) {
    super(`Can't convert the URL "${url}" to ePUB`);
  }
}
