import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useReduxFetch } from '../../../../hooks/useReduxFetch'
import { getUserById } from '../userAdminSlice'
import { userApi } from '../../../AdminApi/userApi'
import Loader2 from '../../../../components/Loader2'
import ImageUploader from '../../Images/SelectImages/ImageUploader'
import DoubleButton from '../../Product/components/DoubleButton/DoubleButton'
import { userUpdateSchema, type UserUpdateFormValues } from '../userSchema'
import { useAppDispatch } from '../../../../store/hooks'

const AdminUserUpdate = () => {
  const [load, setLoad] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const { selectedUser } = useReduxFetch({
    action: getUserById,
    arg: id,
    selector: (state) => state.user,
    deps: [id],
    condition: !!id
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      email: '',
      name: '',
      nickname: '',
      picture: ''
    }
  })

  // Synchronize initial user state to the form
  useEffect(() => {
    if (selectedUser) {
      reset({
        email: selectedUser.email || '',
        name: selectedUser.name || '',
        nickname: selectedUser.nickname || '',
        picture: selectedUser.picture || '',
      });
    }
  }, [selectedUser, reset]);

  const pictureWatch = watch('picture');

  const onClose = () => navigate(-1)

  const onSubmit = async (data: UserUpdateFormValues) => {
    if (!id) return;

    const confirmed = await userApi.confirmAction({ title: 'Esta seguro de actualizar este perfil?' });
    if (!confirmed) return;

    setLoad(true);
    try {
      await userApi.updateProfile(id, {
        email: data.email,
        name: data.name,
        nickname: data.nickname,
        picture: data.picture,
        useImg: !!data.picture
      });
      dispatch(getUserById(id));
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <div className="imageBack">
      {(load || !selectedUser) ? (
        <Loader2 />
      ) : (
        <div className="coverBack">
          <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow mb-4">
            <div className="container mt-5">
              <h1>Actualización de usuario:</h1>
              <form
                className="needs-validation"
                id="updateItemForm"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <ImageUploader
                      titleField={"Imagen:"}
                      value={pictureWatch || selectedUser.picture}
                      onChange={(url) => setValue('picture', url, { shouldValidate: true, shouldDirty: true })}
                    />
                  </div>
                  <div className="col-md-6 mb-3"></div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      type="email"
                      id="email"
                      {...register("email")}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre:
                    </label>
                    <input
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      type="text"
                      id="name"
                      {...register("name")}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="nickname" className="form-label">
                      Apodo:
                    </label>
                    <input
                      className={`form-control ${errors.nickname ? 'is-invalid' : ''}`}
                      type="text"
                      id="nickname"
                      {...register("nickname")}
                    />
                    {errors.nickname && <div className="invalid-feedback">{errors.nickname.message}</div>}
                  </div>

                  <div className="d-flex flex-row me-3">
                    <DoubleButton
                      className1="btn btn-sm btn-primary mb-3 me-2"
                      type1="submit"
                      onClick1={() => {}}
                      disabled1={isSubmitting || !isDirty}
                      buttonText1="Actualizar"
                      id1="submitButton"
                      className2="btn btn-sm btn-secondary mb-3 me-2"
                      onClick2={onClose}
                      buttonText2="Cancelar"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserUpdate