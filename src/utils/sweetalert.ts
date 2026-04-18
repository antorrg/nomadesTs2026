let mySwalInstance: any = null;

export const getSwal = async () => {
    if (!mySwalInstance) {
        const [{ default: Swal }, { default: withReactContent }] = await Promise.all([
            import('sweetalert2'),
            import('sweetalert2-react-content'),
            import('sweetalert2/themes/bootstrap-5.css')
        ]);
        mySwalInstance = withReactContent(Swal);
        mySwalInstance.DismissReason = Swal.DismissReason;
    }
    return mySwalInstance;
};

const showConfirmationDialog = async (message: string) => {
    const swal = await getSwal();
    const result = await swal.fire({
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

const complexDialog = async (
    qTitle: string = '¿Esta seguro?',
    qText: string = 'Esta acción no puede deshacerse',
    aTitle: string = 'Realizado',
    aText: string = 'Su accion ha sido realizada',
    retTitle: string = 'Cancelado',
    retText: string = 'Su archivo esta a salvo'
) => {
    const swal = await getSwal();
    const swalWithBootstrapButtons = swal.mixin({
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
    }).then((result: any) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: aTitle,
                text: aText,
                icon: "success",
                timer: 1500
            });
        } else if (
            result.dismiss === swal.DismissReason.cancel
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
const successAlert = async (message: string = 'Su trabajo esta guardado') => {
    const swal = await getSwal();
    swal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
}

const errorAlert = async (message: string = 'algo paso') => {
    const swal = await getSwal();
    swal.fire({
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