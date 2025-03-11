import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface SettingsProps {
    customPrompt?: string;
    temperature: number;
}

const settingsAtom = atomWithStorage<SettingsProps>('settings', {
    customPrompt: undefined,
    temperature: 0,
});

export function useSettings() {
    const [settings, setSettings] = useAtom(settingsAtom);

}
