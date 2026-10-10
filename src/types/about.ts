export interface IAbout {
  id: number;
  title: string;
  picture: string;
  text: string;
  imgShow: boolean;
  enabled: boolean;
}

export type CreateAbout = Partial<IAbout> & { useImg?: boolean };
export type UpdateAbout = Partial<IAbout> & { useImg?: boolean; saver?: boolean };
