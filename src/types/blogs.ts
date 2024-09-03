export interface ImageThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  thumbnails?: ImageThumbnail[];
  alternateText?: string;
}

export enum LinkType {
  OTHER = "Other",
  URL = "URL",
  PHONE = "Phone",
  EMAIL = "Email",
}

export interface C_primaryCTA {
  label?: string;
  linkType?: LinkType;
  link?: string;
}

export default interface Ce_blogs {
  landingPageUrl?: string;
  richTextDescription?: string;
  name: string;
  c_photo?: Image;
  c_primaryCTA?: C_primaryCTA;
  c_subtitle?: string;
  c_subtitle2?: string;
  shortDescription?: string;
  id: string;
}
