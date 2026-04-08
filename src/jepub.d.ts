declare module 'jepub/dist/jepub.min.js' {
  export interface jEpubInitDetails {
    i18n?: string;
    title?: string;
    author?: string;
    publisher?: string;
    description?: string;
    tags?: string[];
  }

  export interface jEpubUpdateCallbackDetails {
    percent: number;
    currentFile: string;
  }

  export type jEpubUpdateCallback = (metadata: jEpubUpdateCallbackDetails) => void;

  export default class jEpub {
    init(details: jEpubInitDetails): void;
    date(date: Date): void;
    uuid(id: string | number): void;
    cover(data: Blob | ArrayBuffer): void;
    image(data: Blob | ArrayBuffer, IMG_ID: string): void;
    notes(content: string): void;
    add(title: string, content: string | Array<string>, index?: number): void;
    generate(type?: string, onUpdate?: jEpubUpdateCallback): Promise<Blob>;
    static html2text(html: string, noBr: boolean): Promise<Blob>;
  }
}
