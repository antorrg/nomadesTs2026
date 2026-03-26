import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { userApi } from '../../../AdminApi/userApi'
import Loader2 from '../../../../components/Loader2'
import DoubleButton from '../../Product/components/DoubleButton/DoubleButton'
import { userCreateSchema, type UserCreateFormValues } from '../userSchema'
import { useAppDispatch } from '../../../../store/hooks'
import { getAllUsers } from '../userAdminSlice'

const AdminUserCreate = () => {
  const [load, setLoad] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserCreateFormValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onClose = () => navigate(-1)

  const onSubmit = async (data: UserCreateFormValues) => {
    const confirmed = await userApi.confirmAction({ title: 'Esta seguro de crear este usuario?' });
    if (!confirmed) return;

    setLoad(true);
    try {
      await userApi.create({
        email: data.email,
        password: data.password,
        name: '', // Required by CreateUserInput, send empty string or handle logic in backend
        enabled: true
      });
      dispatch(getAllUsers());
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <div className="imageBack">
      {load ? (
        <Loader2 />
      ) : (
        <div className="coverBack">
          <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow mb-4">
            <div className="container mt-5">
              <h1>Creación de usuario:</h1>
              <form
                className="needs-validation"
                id="createItemForm"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="row">
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
                    <label htmlFor="password" className="form-label">
                      Contraseña:
                    </label>
                    <input
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      type="text"
                      id="password"
                      {...register("password")}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>

                  <div className="d-flex flex-row me-3">
                    <DoubleButton
                      className1="btn btn-sm btn-primary mb-3 me-2"
                      type1="submit"
                      onClick1={() => {}}
                      disabled1={isSubmitting}
                      buttonText1="Crear"
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

export default AdminUserCreate