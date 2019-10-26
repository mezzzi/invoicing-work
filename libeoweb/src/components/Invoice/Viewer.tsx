import { Col, Row } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PDF from 'react-pdf-js';
import Magnifying from './Magnifying';

interface IProps {
  src: string;
}

interface IState {
  page: number;
  pages?: any;
}

class Viewer extends React.PureComponent<IProps, IState> {
  state = {
    page: 1,
    pages: undefined,
  };

  handleOnDocumentComplete: (props: any) => void;
  handleChangePage: (page: number) => void;

  boundsRef?: Element;

  manifyingSize = 64;
  constructor(props: any) {
    super(props);

    this.handleOnDocumentComplete = this.onDocumentComplete.bind(this);
    this.handleChangePage = this.changePage.bind(this);
  }

  changePage(page: number) {
    this.setState({ page });
  }

  onDocumentComplete(pages: any) {
    this.setState({ page: 1, pages });
  }

  isPdf(filepath: string): boolean {
    return filepath.match(/\.pdf/i) ? true : false;
  }

  renderPagination = (): React.ReactNode => {
    const { src } = this.props;
    const { page, pages } = this.state;
    const pdfs: React.ReactNode[] = [];

    if (pages) {
      for (let i = 0; i < pages; i++) {
        pdfs.push(
          <div
            key={`${i + 1}`}
            onClick={this.handleChangePage.bind(null, i + 1)}
            className={`pdf-thumb${i + 1 === page ? ' active' : ''}`}
          >
            <div className="pdf-thumb-wrapper">
              <PDF file={src.toLowerCase()} page={i + 1} />
            </div>
            <div className="page-count">
              <FormattedMessage
                id="purchase.control.page"
                values={{
                  number: i + 1,
                }}
              />
            </div>
          </div>,
        );
      }
    }
    return pdfs;
  };
  render() {
    const { src } = this.props;
    const isPdf = this.isPdf(src);

    return (
      <Row className="viewer" gutter={24}>
        {isPdf && <Col className="viewer-pages">{this.renderPagination()}</Col>}
        <Col className="viewer-wrapper viewer-wrapper-pdf">
          <Magnifying>
            {isPdf ? (
              <PDF
                className="preview"
                onDocumentComplete={this.handleOnDocumentComplete}
                file={src.toLowerCase()}
                page={this.state.page}
              />
            ) : (
              <img className="preview" src={src.toLowerCase()} />
            )}
          </Magnifying>
        </Col>
      </Row>
    );
  }
}

export default Viewer;
