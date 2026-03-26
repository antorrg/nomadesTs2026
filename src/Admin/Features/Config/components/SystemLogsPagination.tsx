import { Button } from 'react-bootstrap';
import type { IPagesInfo } from '../../../../../types/systemLogs';

interface SystemLogsPaginationProps {
    info: IPagesInfo;
    page: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

const SystemLogsPagination = ({ info, page, loading, onPageChange }: SystemLogsPaginationProps) => {
    if (info.totalPages <= 1) return null;

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
                Página {info.page} de {info.totalPages} (Total: {info.total})
            </small>
            <div>
                <Button 
                    variant="outline-secondary" size="sm" className="me-2"
                    disabled={page === 1 || loading}
                    onClick={() => onPageChange(page - 1)}
                >
                    <i className="bi bi-chevron-left"></i> Anterior
                </Button>
                <Button 
                    variant="outline-secondary" size="sm"
                    disabled={page === info.totalPages || loading}
                    onClick={() => onPageChange(page + 1)}
                >
                    Siguiente <i className="bi bi-chevron-right"></i>
                </Button>
            </div>
        </div>
    );
};

export default SystemLogsPagination;
