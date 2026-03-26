import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { systemLogsApi } from '../../AdminApi/systemLogsApi';
import type { ILogger, IPaginatedResponse } from '../../../types/systemLogs';
import SystemLogsTable from './components/SystemLogsTable';
import SystemLogsPagination from './components/SystemLogsPagination';
import SystemLogDetailModal from './components/SystemLogDetailModal';

const SystemLogsViewer = () => {
    const [data, setData] = useState<IPaginatedResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedLog, setSelectedLog] = useState<ILogger | null>(null);
    const limit = 10;
 console.log('datos de logs: ', data)
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await systemLogsApi.getAll({ page, limit, order: 'DESC', sortBy: 'id' });
            setData(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const handleKeepToggle = async (log: ILogger) => {
        const confirmed = await systemLogsApi.confirmAction({
            title: `¿${log.keep ? 'Desmarcar' : 'Proteger'} registro?`,
            text: log.keep ? "Podrá ser eliminado en limpiezas masivas" : "No será eliminado en limpiezas masivas",
            icon: 'question'
        });
        if (!confirmed) return;

        setLoading(true);
        try {
            await systemLogsApi.update(log.id, { keep: !log.keep });
            await fetchLogs();
        } catch (e) {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await systemLogsApi.confirmAction({
            title: '¿Eliminar este registro?',
            icon: 'warning'
        });
        if (!confirmed) return;

        setLoading(true);
        try {
            await systemLogsApi.delete(id);
            await fetchLogs();
        } catch (e) {
            setLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = await systemLogsApi.confirmAction({
            title: '¿Eliminar todos los logs?',
            text: '¡Los registros no protegidos (sin chincheta) se perderán permanentemente!',
            icon: 'warning'
        });
        if (!confirmed) return;

        setLoading(true);
        try {
            await systemLogsApi.deleteAll();
            setPage(1);
            await fetchLogs();
        } catch (e) {
             setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">Registros del Sistema</h4>
                <Button variant="danger" size="sm" onClick={handleDeleteAll} disabled={loading}>
                    <i className="bi bi-trash"></i> Eliminar Todos
                </Button>
            </div>

            <SystemLogsTable 
                data={data}
                loading={loading}
                onViewDetails={setSelectedLog}
                onDelete={handleDelete}
                onKeepToggle={handleKeepToggle}
            />

            {data?.info && (
                <SystemLogsPagination 
                    info={data.info}
                    page={page}
                    loading={loading}
                    onPageChange={setPage}
                />
            )}

            <SystemLogDetailModal 
                show={!!selectedLog} 
                onHide={() => setSelectedLog(null)} 
                log={selectedLog} 
            />
        </div>
    );
};

export default SystemLogsViewer;
