import { decode } from "html-entities";

const getImagePath = (path) => `${path}`;
const getBackdropPath = (path) => `${path}`;

export const getBooks = async () => {
  const API_URL = `https://www.etnassoft.com/api/v1/get/?category=${categoryName}`;
  const books = (await fetch(API_URL).then((x) => x.json())).map(
    ({
      ID,
      title,
      cover,
      content_short,
      content,
      author,
      url_download
    }) => ({
      key: String(ID),
      title: title,
      poster: getImagePath(cover),
      backdrop: getBackdropPath(cover),
      author: author,
      description: decode(content_short),
      description_long: decode(content),
      url_download: url_download,
      status: false,
    }),
  );

  return books;
};
