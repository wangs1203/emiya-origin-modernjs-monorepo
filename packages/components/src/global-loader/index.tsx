import './global-loader.less';

interface IGlobalLoaderProps {
  type?: 'line' | 'circle';
}

export default function GlobalLoader({ type = 'line' }: IGlobalLoaderProps) {
  if (type === 'line') {
    return <GlobalLoaderLine />;
  }
  return <GlobalLoaderCircle />;
}

export function GlobalLoaderLine() {
  return (
    <div className="global-loading-line tw-box-border tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
      <div className="line-scale">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
export function GlobalLoaderCircle() {
  return (
    <div className="global-loading-circle tw-flex tw-justify-center tw-items-center tw-absolute tw-w-full tw-h-screen tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-m-auto tw-text-center">
      <div className="tb-bounce1"></div>
      <div className="tb-bounce2"></div>
      <div className="tb-bounce3"></div>
    </div>
  );
}
