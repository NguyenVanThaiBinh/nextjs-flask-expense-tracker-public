import Swal from "sweetalert2";

export default async function isDeleteConfirmAlert(): Promise<boolean> {
  return await Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  });
}

export async function isConfirmChangeLanguageAlert(): Promise<boolean> {
  return await Swal.fire({
    title: "Confirm to change currency?",
    text: "Need to re-login...",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Change it!",
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  });
}
