import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import 'sweetalert2/themes/bootstrap-5.css'


export const MySwal = withReactContent(Swal)

const showConfirmationDialog = async (message: string) => {
    const result = await MySwal.fire({
        title: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn btn-sm btn-info me-2',
            cancelButton: 'btn btn-sm btn-danger me-2'
        },
        buttonsStyling: false
    });
    return result.isConfirmed;
};

const complexDialog = (
    qTitle: string = '¿Esta seguro?',
    qText: string = 'Esta acción no puede deshacerse',
    aTitle: string = 'Realizado',
    aText: string = 'Su accion ha sido realizada',
    retTitle: string = 'Cancelado',
    retText: string = 'Su archivo esta a salvo'
) => {
    const swalWithBootstrapButtons = MySwal.mixin({
        customClass: {
            confirmButton: "btn btn-sm btn-primary me-2",
            cancelButton: "btn btn-sm btn-danger me-2",
        },
        buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
        title: qTitle,
        text: qText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No, cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: aTitle,
                text: aText,
                icon: "success",
                timer: 1500
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: retTitle,
                text: retText,
                icon: "error",
                timer: 1500
            });
        }
    });
}
const successAlert = (message: string = 'Su trabajo esta guardado') => {
    MySwal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
}

const errorAlert = (message: string = 'algo paso') => {
    MySwal.fire({
        position: "top-end",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 1500
    })
}
export {
    showConfirmationDialog,
    complexDialog,
    successAlert,
    errorAlert
}