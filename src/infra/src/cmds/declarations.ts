export type ICmd = {
    name: string;
    shortParameters: string;
    shortDescription: string;
    detailHelp: () => void;
    applyCmd: (args: Array<string>) => Promise<void>;
};
