import Swal from 'sweetalert2'


export const courseUpdateAlert = async () => {
    return (
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I want update!"
        })
    )
}