import * as React from 'react';

interface IUploadInterface {
  create: (file: File, uuid: string) => void;
  filesUploading: File[];
  off: (event: (file?: File) => void) => void;
  offFinish: (event: () => void) => void;
  offStart: (event: () => void) => void;
  on: (event: (file?: File) => void) => void;
  onFinish: (event: () => void) => void;
  onStart: (event: () => void) => void;
  setVisibility: (visible: boolean) => void;
  visible: boolean;
}

export interface IUploadContextInterface {
  upload?: IUploadInterface;
}

const { Provider, Consumer } = React.createContext<IUploadContextInterface>({
  upload: {
    create: () => {},
    filesUploading: [],
    off: () => {},
    offFinish: () => {},
    offStart: () => {},
    on: () => {},
    onFinish: () => {},
    onStart: () => {},
    setVisibility: () => {},
    visible: false,
  },
});

export { Provider, Consumer };
