import * as React from 'react';

interface ICoordinate {
  x: number;
  y: number;
}

interface IProps {
  children: React.ReactNode;
}

interface IState {
  bounds: ClientRect | DOMRect;
  coordinate: ICoordinate;
  over: boolean;
  fixed: boolean;
}

class Magnifying extends React.PureComponent<IProps, IState> {
  state = {
    bounds: {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    },
    coordinate: {
      x: 0,
      y: 0,
    },
    fixed: false,
    over: false,
  };

  handleDocumentRef: (node: React.ReactNode) => void;
  handleMouseEnter: (evt: any) => void;
  handleMouseMove: (evt: any) => void;
  handleMouseLeave: (evt: any) => void;

  boundsRef?: Element;

  manifyingSize = 200;
  constructor(props: any) {
    super(props);

    this.handleDocumentRef = this.documentRef.bind(this);
    this.handleMouseEnter = this.enter.bind(this);
    this.handleMouseMove = this.move.bind(this);
    this.handleMouseLeave = this.leave.bind(this);
  }
  documentRef(node: React.ReactNode) {
    if (!(node instanceof Element)) {
      return;
    }
    this.boundsRef = node;
  }
  enter() {
    this.setState({
      fixed: false,
      over: true,
    });
  }
  move(evt: any) {
    if (this.boundsRef && !this.state.fixed) {
      const bounds = this.boundsRef.getBoundingClientRect();
      const x = evt.clientX - bounds.left;
      const y = evt.clientY - bounds.top;
      const coordinate = {
        x,
        y,
      };

      this.setState({ coordinate, bounds });
    }
  }
  leave() {
    this.setState({ over: false });
  }
  onFix = (evt: any) => {
    if (this.boundsRef && this.state.fixed) {
      const bounds = this.boundsRef.getBoundingClientRect();
      const x = evt.clientX - bounds.left;
      const y = evt.clientY - bounds.top;
      const coordinate = {
        x,
        y,
      };
      this.setState({ coordinate, bounds, fixed: true });
    } else {
      this.setState({
        fixed: true,
      });
    }
  };
  render() {
    const { children } = this.props;
    const { coordinate, over, fixed } = this.state;

    return (
      <div
        onClick={this.onFix}
        className={`pdf-magnifying-glass-wapper${
          fixed ? ' pdf-magnifying-glass-fixed' : ''
        }`}
      >
        {children}
        <div
          ref={this.handleDocumentRef}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          className="pdf-magnifying-glass-preview"
        >
          <div
            className={`pdf-magnifying-glass-inner ${
              over || fixed ? 'visible' : 'hidden'
            }`}
          >
            <div
              style={{
                height: this.manifyingSize,
                left: -this.manifyingSize / 2,
                top: -this.manifyingSize / 2,
                transform: `translate(${coordinate.x}px, ${coordinate.y}px)`,
                width: this.manifyingSize,
              }}
              className="pdf-magnifying-glass-border"
            />
            <div
              className="pdf-magnifying-glass-preview-clip"
              style={{
                clipPath: `circle(${this.manifyingSize / 2}px at ${
                  coordinate.x
                }px ${coordinate.y}px)`,
              }}
            >
              <div
                style={{
                  height: '100%',
                  transform: `scale(2) translate(-${coordinate.x /
                    2}px, -${coordinate.y / 2}px)`,
                  transformOrigin: 'top left',
                  width: '100%',
                }}
              >
                {React.cloneElement(children as any, { scale: 5 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Magnifying;
