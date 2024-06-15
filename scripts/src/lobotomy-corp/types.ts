export interface LobotomyCreature {
  creature: {
    info: {
      narration: string[];
    };
    observe: {
      collection: {
        codeNo: string;
        portrait: string;
        name: string | string[];
        riskLevel: string;
        openText: string;
      };
      desc: (Record<string, string> | string)[];
      specialTipSize:
        | {
            specialTip: string[];
          }
        | "";
    };
  };
}
