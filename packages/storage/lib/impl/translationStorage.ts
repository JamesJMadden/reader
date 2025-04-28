import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import type { TranslationStorage } from '../../../shared';

const storage = createStorage<TranslationStorage>(
  'translation-storage-key',
  {
    theme: 'light',
    storedTranslations: [],
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

// You can extend it with your own methods
export const translationStorage: BaseStorage<TranslationStorage> & {
  selectActiveTranslation: (id: string) => Promise<void>;
  toggle: () => Promise<void>;
} = {
  ...storage,
  selectActiveTranslation: async id => {
    await storage.set(prevState => {
      const activeTranslation = prevState.storedTranslations.find(translation => translation.id === id);

      return { ...prevState, ...activeTranslation };
    });
  },
  toggle: async () => {
    await storage.set(prevState => {
      return { ...prevState, theme: prevState.theme === 'light' ? 'dark' : 'light' };
    });
  },
};
