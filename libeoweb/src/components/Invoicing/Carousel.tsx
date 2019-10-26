import ClassicTemplate from 'components/Invoicing/Assets/images/classic.png';
import MinimalTemplate from 'components/Invoicing/Assets/images/minimal.png';
import StartupTemplate from 'components/Invoicing/Assets/images/startup.png';
import * as React from 'react';
// @ts-ignore
import Coverflow from 'react-coverflow';

interface IProps {
  autoSaveTemplateChange: (template: string) => void;
  getAutoSavedTemplate: () => number;
}

interface IState {
  cursor: number;
}

class Carousel extends React.PureComponent<IProps, IState> {
  private templates: string[] = ['MINIMAL', 'CLASSIC', 'STARTUP'];
  private previousCursor = 2;

  constructor(props: IProps) {
    super(props);
    const { getAutoSavedTemplate } = this.props;
    this.previousCursor = getAutoSavedTemplate();
    this.state = {
      cursor: this.previousCursor,
    };
  }

  handleKeyDown = (e: any) => {
    const { cursor } = this.state;
    const { autoSaveTemplateChange } = this.props;
    // arrow left/right button should select next/previous list element
    if (e.keyCode === 37 && cursor > 0) {
      this.setState(
        prevState => ({
          cursor: prevState.cursor - 1,
        }),
        () => {
          autoSaveTemplateChange(this.templates[this.state.cursor]);
        },
      );
    } else if (e.keyCode === 39 && cursor < this.templates.length - 1) {
      this.setState(
        prevState => ({
          cursor: prevState.cursor + 1,
        }),
        () => {
          autoSaveTemplateChange(this.templates[this.state.cursor]);
        },
      );
    }
  };

  handleClick = (cursor: number) => {
    const { autoSaveTemplateChange } = this.props;
    this.setState({
      cursor,
    });
    autoSaveTemplateChange(this.templates[cursor]);
  };

  onMinimalClick = (event: any) => {
    this.handleClick(0);
  };

  onClassicClick = (event: any) => {
    this.handleClick(1);
  };

  onStartupClick = (event: any) => {
    this.handleClick(2);
  };

  render() {
    const { cursor } = this.state;
    return (
      <>
        <Coverflow
          height="500"
          currentFigureScale={2}
          displayQuantityOfSide={2}
          navigation={false}
          clickable={true}
          enableScroll={false}
          active={cursor}
          enableHeading={false}
        >
          <div
            onKeyDown={this.handleKeyDown}
            onClick={this.onMinimalClick}
            role="menuitem"
            // @ts-ignore
            tabIndex="0"
          >
            <img
              src={MinimalTemplate}
              style={{
                display: 'block',
                width: '100%',
              }}
              alt="MINIMAL"
            />
          </div>
          <div
            onKeyDown={this.handleKeyDown}
            onClick={this.onClassicClick}
            role="menuitem"
            // @ts-ignore
            tabIndex="1"
          >
            <img
              src={ClassicTemplate}
              style={{
                display: 'block',
                width: '100%',
              }}
              alt="CLASSIC"
            />
          </div>

          <div
            onKeyDown={this.handleKeyDown}
            onClick={this.onStartupClick}
            role="menuitem"
            // @ts-ignore
            tabIndex="2"
          >
            <img
              src={StartupTemplate}
              style={{
                display: 'block',
                width: '100%',
              }}
              alt="STARTUP"
            />
          </div>
        </Coverflow>
        <div
          style={{ textAlign: 'center', color: '#003fd4', marginTop: '5px' }}
        >
          {this.templates[this.state.cursor]}
        </div>
      </>
    );
  }
}

export default Carousel;
