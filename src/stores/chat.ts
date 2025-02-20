import { create } from 'zustand';

interface Message {
	id: string;
	prompt: string;
	think: string;
	response: string;
}

type State = {
	history: Message[];
	currentMessage: Message | null;
};

type Action = {
    prompt: (prompt: string) => Promise<void>;
    abort: () => void;

};

export const useChatStore = create<State & Action>((set) => ({
    history: [],
    currentMessage: null,
    
    prompt: async (prompt: string) => {

    },
    
    abort: () => {
    }
}));
