export interface LocalizedText {
  sr: string;
  en?: string;
}

export class GameModel {
  id = '';
  // bilingual fields: use `name.sr` for Serbian display, `name.en` for English
  name: LocalizedText = { sr: '', en: '' };
  price = 0;
  players = '';
  age = '';
  duration = '';
  images: string[] = []; // relative paths in /assets/images/games/
  group: LocalizedText = { sr: '', en: '' }; // bilingual group name
  // bilingual description
  description?: LocalizedText;
}

