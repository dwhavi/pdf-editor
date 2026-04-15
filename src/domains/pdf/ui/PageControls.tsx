// PDF Page Controls — navigation + zoom
import { usePdfStore } from '@/domains/pdf/store';
import { goToPage, zoomIn, zoomOut } from '@/domains/pdf/service';

export function PageControls() {
  const { currentPage, totalPages, zoom } = usePdfStore((s) => s.viewport);

  return (
    <div className="page-controls" id="page-controls">
      {/* Page navigation */}
      <button
        id="btn-prev-page"
        className="page-controls__btn"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        title="이전 페이지"
      >
        ‹
      </button>

      <span className="page-controls__info">
        {currentPage} / {totalPages}
      </span>

      <button
        id="btn-next-page"
        className="page-controls__btn"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        title="다음 페이지"
      >
        ›
      </button>

      {/* Zoom */}
      <div className="page-controls__zoom">
        <button
          id="btn-zoom-out"
          className="page-controls__btn"
          onClick={zoomOut}
          title="축소"
        >
          −
        </button>
        <span className="page-controls__zoom-label">
          {Math.round(zoom * 100)}%
        </span>
        <button
          id="btn-zoom-in"
          className="page-controls__btn"
          onClick={zoomIn}
          title="확대"
        >
          +
        </button>
      </div>
    </div>
  );
}
