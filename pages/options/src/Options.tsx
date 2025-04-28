import '@src/Options.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';

const Options = () => {
  return (
    <div className={'App text-gray-100 bg-gray-800'}>
      <p>
        Edit <code>pages/options/src/Options.tsx</code>
      </p>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
