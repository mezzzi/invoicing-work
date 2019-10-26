import * as Beneficiaries from 'context/Beneficiaries';
import { IBeneficiaryInput, IDocument } from 'context/Beneficiaries/types';
import * as React from 'react';
import { compose } from 'react-apollo';

export type beneciaryStep =
  | 'who'
  | 'common'
  | 'address'
  | 'complementary'
  | 'power';

export type beneciaryType =
  | 'beneciary_not_listed'
  | 'not_beneciary'
  | 'beneciary';

export interface ITempBeneficiaryContext {
  type?: beneciaryType;
  baseUrl?: string;
  nextUrl?: string;
  currentUserId?: number;
  tempBeneficiary?: IBeneficiaryInput;
  employeeType?: number;
  removeBeneficiary: (userId: number) => void;
  isCurrent?: boolean;
  removeDocument: (documentId: number) => void;
  saveBeneficiary: (Beneficiary?: IBeneficiaryInput) => void;
  currentStep?: string;
  nextStep?: string;
  updateTempBeneficiary: (userId?: number, employeeType?: number) => void;
  updateValues: (values: any) => void;
  values: any;
}

const Context = React.createContext<ITempBeneficiaryContext>({
  baseUrl: '',
  currentStep: undefined,
  currentUserId: undefined,
  employeeType: undefined,
  isCurrent: undefined,
  nextStep: undefined,
  nextUrl: '',
  removeBeneficiary: () => {},
  removeDocument: () => {},
  saveBeneficiary: () => {},
  tempBeneficiary: undefined,
  type: undefined,
  updateTempBeneficiary: () => {},
  updateValues: () => {},
  values: {},
});

const Consumer = Context.Consumer;

interface IProps extends Beneficiaries.InjectedProps {
  children: React.ReactNode;
  isCurrent?: boolean;
  baseUrl?: string;
  nextUrl?: string;
  currentStep?: string;
  nextStep?: string;
}

interface IState extends ITempBeneficiaryContext {}

class Provider extends React.PureComponent<IProps, IState> {
  state = {
    baseUrl: '',
    currentStep: undefined,
    currentUserId: undefined,
    employeeType: undefined,
    isCurrent: undefined,
    nextStep: undefined,
    nextUrl: '',
    removeBeneficiary: async (userId: number) => {
      const remove =
        this.props.beneficiaries && this.props.beneficiaries.remove;
      if (remove && userId) {
        await remove(userId);
      }
    },
    removeDocument: async (documentId: number) => {
      const tempBeneficiary: any = this.state.tempBeneficiary;
      const removeDocument =
        this.props.beneficiaries && this.props.beneficiaries.removeDocument;

      if (removeDocument) {
        const document = await removeDocument(documentId);
        const newDocuments: IDocument[] = [];
        if (document && tempBeneficiary && tempBeneficiary.documents) {
          tempBeneficiary.documents.rows.map((doc: IDocument) => {
            if (doc.documentId !== document.documentId) {
              newDocuments.push(document);
            }
          });
          return this.setState({
            tempBeneficiary: {
              ...tempBeneficiary,
              documents: newDocuments,
            },
          });
        }
      }
    },
    saveBeneficiary: async (beneficiary?: IBeneficiaryInput) => {
      const currentBeneficiary = this.getBeneficiary();
      const currentUserId =
        this.state.currentUserId ||
        (currentBeneficiary && currentBeneficiary.userId);
      const userTag: any =
        currentBeneficiary &&
        currentBeneficiary.userTag &&
        JSON.parse(currentBeneficiary.userTag);
      let isHosted = false;
      if (beneficiary && typeof beneficiary.isHosted !== 'undefined') {
        isHosted = beneficiary.isHosted;
      } else if (userTag && userTag.isHosted) {
        isHosted = userTag.isHosted;
      }

      const updateBeneficiary: IBeneficiaryInput = {
        ...beneficiary,
        isCurrentUser: this.props.isCurrent,
        isHosted,
        userId: currentUserId,
      };
      if (!updateBeneficiary.userId) {
        // update only if not allready exist
        updateBeneficiary.employeeType = this.state.employeeType;
      }

      delete (beneficiary as any).__typename;
      const create =
        this.props.beneficiaries && this.props.beneficiaries.create;
      if (create && beneficiary) {
        const result: any = await create(updateBeneficiary);
        if (result) {
          const userId: number = (result as any).userId;
          this.setState({
            currentUserId: userId,
          });
        }
      }
    },
    tempBeneficiary: undefined,
    type: undefined,
    updateTempBeneficiary: async (userId?: number, employeeType?: number) => {
      return this.setState({
        currentUserId: userId,
        employeeType,
      });
    },
    updateValues: (values: any) => {
      this.setState({
        values,
      });
    },
    values: {},
  };

  getBeneficiaryById(userId?: number): IBeneficiaryInput | undefined {
    const beneficiaries =
      this.props.beneficiaries &&
      this.props.beneficiaries.beneficiaries &&
      this.props.beneficiaries.beneficiaries.beneficiaries &&
      this.props.beneficiaries.beneficiaries.beneficiaries.rows;

    const tempBeneficiary: IBeneficiaryInput | undefined =
      this.props.beneficiaries &&
      beneficiaries &&
      beneficiaries.find(
        (beneficiary: IBeneficiaryInput) =>
          userId === beneficiary.userId && beneficiary,
      );

    return tempBeneficiary;
  }

  getBeneficiaryCurrent(): IBeneficiaryInput | undefined {
    const beneficiaries =
      this.props.beneficiaries &&
      this.props.beneficiaries.beneficiaries &&
      this.props.beneficiaries.beneficiaries.beneficiaries &&
      this.props.beneficiaries.beneficiaries.beneficiaries.rows;

    const tempBeneficiary: IBeneficiaryInput | undefined =
      this.props.beneficiaries &&
      beneficiaries &&
      beneficiaries.find(
        (beneficiary: IBeneficiaryInput) =>
          beneficiary.userTag && JSON.parse(beneficiary.userTag).userId,
      );

    return tempBeneficiary;
  }

  getBeneficiary(): IBeneficiaryInput | undefined {
    let currentUserId: number | undefined = this.state.currentUserId;
    const { isCurrent } = this.props;
    let tempBeneficiary;
    if (!currentUserId && isCurrent) {
      tempBeneficiary = this.getBeneficiaryCurrent();
      if (tempBeneficiary && tempBeneficiary.userId) {
        currentUserId = tempBeneficiary.userId;
      }
    } else if (currentUserId) {
      tempBeneficiary = this.getBeneficiaryById(currentUserId);
    }
    return tempBeneficiary;
  }

  render() {
    const { values } = this.state;
    const tempBeneficiary = this.getBeneficiary();

    return (
      <Context.Provider
        value={{
          ...this.state,
          baseUrl: this.props.baseUrl,
          currentStep: this.props.currentStep,
          isCurrent: this.props.isCurrent,
          nextStep: this.props.nextStep,
          nextUrl: this.props.nextUrl,
          tempBeneficiary,
          values: {
            ...tempBeneficiary,
            ...values,
          },
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

const composedProvider = compose(Beneficiaries.hoc())(Provider);

export { composedProvider as Provider, Consumer };
