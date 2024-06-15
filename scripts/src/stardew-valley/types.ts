export interface StardewValleyStringXnbData {
  xnbData: {
    target: string;
    compressed: boolean;
    hiDef: boolean;
    readerData: any;
    numSharedResources: number;
  };
  content: Record<string, string>;
}
