import { ApolloClient } from 'apollo-client';
import { UploadWrapper } from 'components/Upload';
import * as Alert from 'context/Alert';
import * as Company from 'context/Company';
import { createOrUpdateCompany } from 'context/Company/queries';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import { EventEmitter } from 'events';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import Dropzone from 'react-dropzone';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { parseError } from 'utils';
import uuidv1 from 'uuid/v1';
import { IUploadContextInterface, Provider } from './context';
import { createInvoice } from './queries';

interface IState extends IUploadContextInterface {}

interface IProps
  extends InjectedIntlProps,
    Alert.InjectedProps,
    User.InjectedProps,
    Company.InjectedProps,
    RouteComponentProps {
  children: React.ReactNode;
  client: ApolloClient<any>;
  createInvoice: any;
  createOrUpdateCompany: any;
}

class AuthProvider extends React.PureComponent<IProps, IState> {
  state = {
    upload: {
      create: async (file: File, uuid: string) => {
        try {
          const results = await this.props.createInvoice({
            variables: { input: { file } },
          });

          if (results.data.createInvoice) {
            this.next({ ...results.data.createInvoice, uuid }, false);
          }
          if (results.errors) {
            this.next(
              { name: file.name, size: file.size, uuid },
              false,
              parseError(results.errors).join(' '), // 'common.upload.server_error'
            );
          }
        } catch (e) {
          this.next(
            file,
            false,
            parseError(e).join(' '), // 'common.upload.server_error'
          );
        }
      },
      filesUploading: [],
      off: (event: (file?: File) => void) => {
        this.events && this.events.removeListener('onUpload', event);
      },
      offFinish: (event: () => void) => {
        this.events && this.events.removeListener('finish', event);
      },
      offStart: (event: () => void) => {
        this.events && this.events.removeListener('start', event);
      },
      on: (event: (file?: File) => void) => {
        this.events && this.events.addListener('onUpload', event);
      },
      onFinish: (event: () => void) => {
        this.events && this.events.addListener('finish', event);
      },
      onStart: (event: () => void) => {
        this.events && this.events.addListener('start', event);
      },
      setVisibility: (visible: boolean) => {
        const { upload } = this.state;
        this.setState({
          upload: {
            ...upload,
            visible,
          },
        });
      },
      visible: false,
    },
  };

  handleDisableClick: (e: any) => void;
  handleClickUpload: (file: File) => void;
  handleDrop: (acceptedFiles: File[], rejectedFiles: File[]) => void;
  handleDropAccepted: (acceptedOrRejected: File[]) => void;
  handleDropRejected: (acceptedOrRejected: File[]) => void;
  handleZonRef: (node: React.ReactNode) => void;

  events: EventEmitter = new EventEmitter();

  waitingFiles: File[] = [];
  uploadingFiles: File[] = [];
  limit = 10;

  creating: boolean = false;

  constructor(props: any) {
    super(props);

    this.handleDisableClick = this.disableClick.bind(this);
    this.handleClickUpload = this.clickUpload.bind(this);
    this.handleDrop = this.drop.bind(this);
    this.handleDropAccepted = this.accepted.bind(this);
    this.handleDropRejected = this.rejected.bind(this);
    this.handleZonRef = this.zone.bind(this);
  }

  disableClick(e: any) {
    e.preventDefault();
  }

  drop() {
    this.state.upload.setVisibility(false);
  }

  toFile = (f: any): any => {
    return {
      error: false,
      loading: true,
      original: f,
      uuid: uuidv1(),
    };
  };

  clickUpload = (file: File) => {
    this.addToQueueOrUpload([file]);
  };

  next = (file?: any, finish?: boolean, error?: string) => {
    let done = true;
    if (file) {
      this.events && this.events.emit('onUpload', file);
    }

    this.uploadingFiles = this.uploadingFiles.map((updatedFile: any) => {
      if (file && updatedFile.uuid === file.uuid) {
        updatedFile.loading = finish;
        updatedFile.error = error;
      }
      if (updatedFile.loading) {
        done = false;
      }

      return updatedFile;
    });

    if (this.waitingFiles.length === 0 && done) {
      this.events && this.events.emit('finish');
      this.setState({
        upload: { ...this.state.upload, filesUploading: this.uploadingFiles },
      });
      this.uploadingFiles = [];
      this.waitingFiles = [];
      return;
    }
    let limit = 1;
    if (this.uploadingFiles.length < this.limit) {
      limit = this.limit - this.uploadingFiles.length + 1;
    }

    const filesToUpload: any[] = this.waitingFiles.splice(0, limit);

    const fileToWatch = this.start(filesToUpload);
    this.uploadingFiles = [...this.uploadingFiles, ...fileToWatch];
    this.setState({
      upload: {
        ...this.state.upload,
        filesUploading: [...this.uploadingFiles, ...this.waitingFiles],
      },
    });
  };

  accepted = (acceptedOrRejected: File[]) => {
    this.addToQueueOrUpload(acceptedOrRejected);
  };

  prepare = (files: File[]) => {
    return files.map(file => {
      const fileRef = this.toFile(file);
      if (file.size / 10000000 >= 10) {
        fileRef.error = 'common.upload.error_file_too_big';
      }
      return fileRef;
    });
  };

  start = (files: any[]) => {
    return files.map(file => {
      if (!file.error) {
        this.state.upload.create(file.original, file.uuid);
      }
      return file;
    });
  };
  addToQueueOrUpload = (files: File[]) => {
    this.events && this.events.emit('start');
    const limit = this.limit;
    const filesWaiting: any[] = this.prepare(files.splice(0));

    const { user } = this.props;
    const currentCompany: ICompany =
      user && user.data && user.data.me && user.data.me.currentCompany;

    if (!currentCompany) {
      this.createCompanyIfFirstUpload();
      this.waitingFiles = [...this.waitingFiles, ...filesWaiting];
    } else {
      let filesToUpload = [];
      if (filesWaiting.length >= limit - this.uploadingFiles.length) {
        filesToUpload = filesWaiting.splice(
          0,
          limit - this.uploadingFiles.length,
        );
        this.waitingFiles = [...this.waitingFiles, ...filesWaiting];
      } else {
        filesToUpload = filesWaiting;
      }
      filesToUpload = this.start(filesToUpload);
      this.uploadingFiles = [...this.uploadingFiles, ...filesToUpload];
    }

    this.setState({
      upload: {
        ...this.state.upload,
        filesUploading: [...this.uploadingFiles, ...this.waitingFiles],
        visible: false,
      },
    });
  };
  createCompanyIfFirstUpload = async () => {
    if (!this.creating) {
      this.creating = true;
      const { user } = this.props;
      const currentCompany: ICompany =
        user && user.data && user.data.me && user.data.me.currentCompany;
      if (!currentCompany) {
        const { data, errors } = await this.props.createOrUpdateCompany({
          variables: {},
        });
        if (user && user.refresh) {
          const me = await user.refresh();
        }
        this.next();
        this.creating = false;
        if (errors) {
          return;
        }
      }
    }
  };

  rejected = (acceptedOrRejected: File[]) => {
    setTimeout(() => {
      const files: any[] = acceptedOrRejected.map(file => ({
        error: 'common.upload.invalid_file',
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      this.uploadingFiles = [...this.uploadingFiles, ...files];

      this.setState(
        {
          upload: {
            ...this.state.upload,
            filesUploading: [...this.uploadingFiles, ...this.waitingFiles],
          },
        },
        () => {
          this.state.upload.setVisibility(false);
        },
      );
    }, 100);
  };

  zone() {}

  render() {
    const { upload } = this.state;
    const visible = upload && upload.visible;

    return (
      <Dropzone
        maxSize={10000000}
        accept="image/jpeg, image/jpg, image/png, application/pdf, image/bmp, image/gif, image/png"
        // onClick={this.handleDisableClick}
        onDrop={this.handleDrop}
        onDropAccepted={this.handleDropAccepted}
        onDropRejected={this.handleDropRejected}
      >
        {({ isDragActive, getRootProps, getInputProps }) => {
          return (
            <Provider value={{ upload }}>
              <>
                <UploadWrapper
                  rootProps={getRootProps()}
                  inputProps={getInputProps()}
                  onClickUpload={this.handleClickUpload}
                  visible={isDragActive || visible}
                  drag={isDragActive}
                  setVisibility={this.state.upload.setVisibility}
                >
                  {this.props.children}
                </UploadWrapper>
              </>
            </Provider>
          );
        }}
      </Dropzone>
    );
  }
}

export default compose(
  withApollo,
  injectIntl,
  withRouter,
  Alert.hoc(),
  User.hoc(),
  graphql(createInvoice, { name: 'createInvoice' }),
  graphql(createOrUpdateCompany, { name: 'createOrUpdateCompany' }),
  Company.hoc(),
)(AuthProvider);
