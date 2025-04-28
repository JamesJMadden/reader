import '@src/SidePanel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { translationStorage } from '@extension/storage';

const SidePanel = () => {
  const storage = useStorage(translationStorage);

  console.log('%c TEST: SidePanel.SidePanel', 'background-color:black;color:green;padding:8px', {
    storage,
  });

  return (
    <div className="App bg-gray-800">
      <header className="App-header text-gray-100">
        <h1>{storage.translation?.title?.raw[0].map((translation, index) => <p key={index}>{translation[0]}</p>)}</h1>
      </header>
      <main>
        <article className="text-left text-gray-100">
          {storage.translation?.textContent?.raw[0].map((translation, index) => <p key={index}>{translation[0]}</p>)}
        </article>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
