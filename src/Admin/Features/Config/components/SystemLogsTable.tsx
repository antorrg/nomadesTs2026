import { Badge, Table, Button, Spinner, Form } from 'react-bootstrap';
import type { ILogger, IPaginatedResponse } from '../../../../../types/systemLogs';

interface SystemLogsTableProps {
    data: IPaginatedResponse | null;
    loading: boolean;
    onViewDetails: (log: ILogger) => void;
    onDelete: (id: number) => void;
    onKeepToggle: (log: ILogger) => void;
}

const getBadgeColor = (levelName: string) => {
    switch (levelName.toUpperCase()) {
        case 'ERROR': return 'danger';
        case 'WARN': return 'warning';
        case 'INFO': return 'info';
        case 'DEBUG': return 'secondary';
        default: return 'primary';
    }
};

const SystemLogsTable = ({ data, loading, onViewDetails, onDelete, onKeepToggle }: SystemLogsTableProps) => {
    return (
        <div className="bg-white rounded border overflow-hidden">
            <Table responsive hover className="mb-0">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nivel</th>
                        <th>Fecha</th>
                        <th>Guardar</th>
                        <th>Mensaje</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && !data ? (
                        <tr><td colSpan={6} className="text-center py-4"><Spinner animation="border" /></td></tr>
                    ) : !data?.results || data.results.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-4">No hay logs registrados.</td></tr>
                    ) : (
                        data.results.map((log) => (
                            <tr key={log.id}>
                                <td>{log.id}</td>
                                <td>
                                    <Badge bg={getBadgeColor(log.levelName)}>{log.levelName}</Badge>
                                </td>
                                <td>{new Date(log.time).toLocaleString()}</td>
                                <td>
                                    <Form.Check 
                                        type="switch"
                                        id={`keep-switch-${log.id}`}
                                        checked={log.keep}
                                        onChange={() => onKeepToggle(log)}
                                    />
                                </td>
                                <td className="text-truncate" style={{ maxWidth: '250px' }}>
                                    <small>{log.message}</small>
                                </td>
                                <td className="text-end">
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onViewDetails(log)}>
                                        <i className="bi bi-eye"></i> Detalles
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(log.id)}>
                                        <i className="bi bi-x-circle"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default SystemLogsTable;
